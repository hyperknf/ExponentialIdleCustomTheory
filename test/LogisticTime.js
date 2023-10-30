import { ExponentialCost, FirstFreeCost, FreeCost, LinearCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"

var id = "LogisticTime"
var name = "Logistic Time"
var description = "Logistic Time by HyperKNF"
var authors = "HyperKNF"
var version = 1

var currency
var q1, q2, c
var reset_time

var drho = BigNumber.ZERO

var time = BigNumber.ZERO

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    {
        const getDesc = level => `q_1=${getQ1(level).toString(0)}`
        q1 = theory.createUpgrade(100, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))))
        q1.getDescription = _ => Utils.getMath(getDesc(q1.level))
        q1.getInfo = amount => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount))
    }

    {
        const getDesc = level => `q_2=2^{${level}}`
        const getInfo = level => `q_2=${getQ2(level)}`
        q2 = theory.createUpgrade(200, currency, new ExponentialCost(15, Math.log2(10)))
        q2.getDescription = _ => Utils.getMath(getDesc(q2.level))
        q2.getInfo = amount => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount))
    }

    {
        const getDesc = level => `c=${getC(level).toString(0)}`
        c = theory.createUpgrade(1000, currency, new ExponentialCost(BigNumber.TEN.pow(10), Math.log2(BigNumber.TEN.pow(10))))
        c.getDescription = _ => Utils.getMath(getDesc(c.level))
        c.getInfo = amount => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8)
    theory.createBuyAllUpgrade(1, currency, 1e9)
    theory.createAutoBuyerUpgrade(2, currency, 1e15)

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

    time += time >= getC(c.level) ? getC(c.level) - time : dt
    drho = bonus * getQ1(q1.level) * getQ2(q2.level) * getLogisticValue(time)
    currency.value += dt * drho

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 43
    return `\\dot{\\rho}=q_1q_2(\\frac{c-t}{c})\\sqrt{t}`
}
var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 45
    const result = [
        `${theory.latexSymbol}=\\max{\\rho}`,
        `\\dot{t}=\\begin{cases}1, & t<c\\\\c-t, & t\\ge c\\end{cases}`
    ]
    return `\\begin{array}{c} ${result.join(`\\\\`)} \\end{array}`
}
var getTertiaryEquation = () => {
    const result = [
        `\\dot{\\rho}=${drho}`,
        `t=${time.toString(1)}`
    ]
    return result.join(",\\quad ")
}

var getPublicationMultiplier = (tau) => tau.pow(0.15)
var getPublicationMultiplierFormula = (symbol) => `${symbol}^{0.15}`
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (1 + currency.value.abs()).log10().toNumber()

var getQ1 = level => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getQ2 = level => BigNumber.TWO.pow(level)
var getC = level => 100 + 100 * Utils.getStepwisePowerSum(level, 10, 9, 0)

var getLogisticValue = time => (getC(c.level) - time) / getC(c.level) * time.sqrt()

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

init()
