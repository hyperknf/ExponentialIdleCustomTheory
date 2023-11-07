import { ConstantCost, ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"
import { Localization } from "./api/Localization"

var id = "TimeCurve"
var name = "Time Curve"
var description = "Time Curve by HyperKNF"
var authors = "HyperKNF"
var version = 1

var currency
var q1, q2, c, t1
var reset_time

var unlock_q

var drho = BigNumber.ZERO, ft = BigNumber.ZERO

var time = BigNumber.ZERO

var auto_reset, display_ft, refund_t1
var displaying_ft = false

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    {
        const getDesc = level => `q_1=${getQ1(level).toString(0)}`
        q1 = theory.createUpgrade(100, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))))
        q1.getDescription = _ => Utils.getMath(getDesc(q1.level))
        q1.getInfo = amount => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount))
    }

    {
        const getDesc = level => `q_2=2^{${level}}`
        const getInfo = level => `q_2=${getQ2(level).toString(0)}`
        q2 = theory.createUpgrade(200, currency, new ExponentialCost(15, Math.log2(5)))
        q2.getDescription = _ => Utils.getMath(getDesc(q2.level))
        q2.getInfo = amount => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount))
    }

    {
        const getDesc = level => `c=${getC(level).toString(0)}`
        c = theory.createUpgrade(1000, currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
        c.getDescription = _ => Utils.getMath(getDesc(c.level))
        c.getInfo = amount => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount))
    }

    {
        const getDesc = level => `t_1=1.25^{${level}}`
        const getInfo = level => `t_1=${getT1(level)}`
        t1 = theory.createUpgrade(2000, currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
        t1.getDescription = _ => Utils.getMath(getDesc(t1.level))
        t1.getInfo = amount => Utils.getMathTo(getInfo(t1.level), getInfo(t1.level + amount))
    }

    /////////////////////
    // Permanent Upgrades

    theory.createPublicationUpgrade(0, currency, 1e9)
    theory.createBuyAllUpgrade(1, currency, 1e10)
    theory.createAutoBuyerUpgrade(2, currency, 1e15)

    {
        auto_reset = theory.createPermanentUpgrade(100, currency, new ConstantCost(BigNumber.TEN.pow(100)))
        auto_reset.description = Utils.getMath(`\\text{Automatic }t\\text{ resetter}`)
        auto_reset.info = Utils.getMathTo(`\\dot{t}=c-t,\\quad t \\ge c`,`\\dot{t}=-t,\\quad t \\ge c`)
        auto_reset.maxLevel = 1
    }

    {
        display_ft = theory.createPermanentUpgrade(1000, currency, new FreeCost())
        display_ft.getDescription = _ => !displaying_ft ? Utils.getMath(`\\text{Display }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Display }\\rho\\text{ on graph}`)
        display_ft.getInfo = _ => !displaying_ft ? Utils.getMath(`\\text{Displays }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Displays }\\rho\\text{ on graph}`)
        display_ft.bought = _ => {
            display_ft.level = 0
            displaying_ft = !displaying_ft
            theory.clearGraph()
        }
    }

    {
        refund_t1 = theory.createPermanentUpgrade(2000, currency, new FreeCost())
        refund_t1.description = Utils.getMath(`\\text{Refund }t_1`)
        refund_t1.info = Utils.getMath(`\\text{Refunds }t_1`)
        refund_t1.bought = _ => {
            refund_t1.level = 0
            if (t1.level <= 0) return
            t1.level--
            currency.value += t1.cost.getCost(t1.level)
        }
    }

    ////////////////////
    // Singular Upgrades

    {
        const getDesc = () => `t\\leftarrow0`
        reset_time = theory.createSingularUpgrade(0, currency, new FreeCost())
        reset_time.getDescription = () => Utils.getMath(getDesc())
        reset_time.getInfo = () => Utils.getMath(getDesc())
        reset_time.bought = _ => {
            reset_time.level = 0
            time = BigNumber.ZERO
        }
    }

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(20, 20))

    {
        unlock_q = theory.createMilestoneUpgrade(100, 1)
        unlock_q.getDescription = _ => Localization.getUpgradeAddTermDesc(`q`)
        unlock_q.getInfo = _ => Localization.getUpgradeAddTermInfo(`q`)
    }
    
    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability()
}

var updateAvailability = () => {
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier

    time += time >= getC(c.level) ? (auto_reset.level >= 1 ? -time : getC(c.level) - time) : dt * getT1(t1.level)
    ft = getFtValue(time)
    drho = bonus * getQ1(q1.level) * getQ2(q2.level) * ft
    currency.value += dt * drho

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 22
    return `\\dot{\\rho}=q_1q_2f(t)`
}
var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 85
    const result = [
        `${theory.latexSymbol}=\\max{\\rho}`,
        `\\dot{t}=\\begin{cases}t_1, & t<c\\\\${auto_reset.level >= 1 ? `-t` : `c-t`}, & t\\ge c\\end{cases}`,
        `f(t)=\\frac{(c-t)\\sqrt{t}}{c}`
    ]
    return `\\begin{array}{c} ${result.join(`\\\\`)} \\end{array}`
}
var getTertiaryEquation = () => {
    const result = [
        `\\dot{\\rho}=${drho}`,
        `t=${time.toString(1)}`,
        `f(t)=${ft}`
    ]
    return result.join(",\\quad ")
}

var getPublicationMultiplier = (tau) => tau.pow(0.15)
var getPublicationMultiplierFormula = (symbol) => `${symbol}^{0.15}`
var getTau = () => currency.value
var get2DGraphValue = () => {
    if (!displaying_ft) return currency.value.sign * (1 + currency.value.abs()).log10().toNumber()
    return getFtDisplay(time)
}

var getQ1 = level => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getQ2 = level => BigNumber.TWO.pow(level)
var getC = level => 100 + 100 * Utils.getStepwisePowerSum(level, 10, 9, 0)
var getT1 = level => BigNumber.from(1.25).pow(level)

var getFtValue = time => (getC(c.level) - time) / getC(c.level) * time.sqrt()

var getFtDisplay = time => {
    const modifier = getC(c.level) / 5
    return ((5 - time / modifier) / 5 * (time / modifier).sqrt()).toNumber()
}

var getInternalState = () => {
    return JSON.stringify({
        time: time.toBase64String()
    })
}
var setInternalState = string => {
    if (!string) return
    const state = JSON.parse(string)
    
    const time_state = state.time ?? BigNumber.ZERO.toBase64String()
    time = BigNumber.fromBase64String(time_state)
}

var postPublish = () => {
    time = BigNumber.ZERO
}

init()
