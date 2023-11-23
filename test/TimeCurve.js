import { ConstantCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"
import { Localization } from "./api/Localization"

var id = "TimeCurve"
var name = "Curve of Time"
var description = "Curve of Time by HyperKNF"
var authors = "HyperKNF"
var version = "1.3"

var currency
var q1, q2, r1, r2, c, t1
var reset_time

var unlock_q, increase_drho_multi, increase_dq_multi

var drho = BigNumber.ZERO, dq = BigNumber.ZERO, ft = BigNumber.ZERO, gt = BigNumber.ZERO

var time = BigNumber.ZERO, q = BigNumber.ONE

var default_perm_upgrades = {
    publications: null,
    buy_all: null,
    auto_buyer: null
}
var auto_reset, unlock_q_terms, display_ft, display_gt, refund_t1
var displaying_ft = false, displaying_gt = false

var settings = {
    tau_rate: 0.5,
    publication_divide_power: 4,
    t1_decay_rate: 1.08,
    milestones: [
        12,
        28,
        36
    ],
    milestone_drho_multi: 2,
    q_terms_costs: [
        BigNumber.TEN.pow(15),
        BigNumber.TEN.pow(20)
    ],
    milestone_dq_multi: 2
}

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    {
        const getDesc = level => `q_1=${getQ1(level).toString(0)}`
        q1 = theory.createUpgrade(100, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.75))))
        q1.getDescription = _ => Utils.getMath(getDesc(q1.level))
        q1.getInfo = amount => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount))
    }

    {
        const getDesc = level => `q_2=2^{${level}}`
        const getInfo = level => `q_2=${getQ2(level).toString(0)}`
        q2 = theory.createUpgrade(200, currency, new ExponentialCost(15, Math.log2(6)))
        q2.getDescription = _ => Utils.getMath(getDesc(q2.level))
        q2.getInfo = amount => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount))
    }

    {
        const getDesc = level => `r_1=${getR1(level).toString(0)}`
        r1 = theory.createUpgrade(1000, currency, new ExponentialCost(BigNumber.TEN.pow(settings.milestones[0]), Math.log2(1.8)))
        r1.getDescription = _ => Utils.getMath(getDesc(r1.level))
        r1.getInfo = amount => Utils.getMathTo(getDesc(r1.level), getDesc(r1.level + amount))
    }

    {
        const getDesc = level => `r_2=3^{${getR2Exponent(level).toString(1)}}`
        const getInfo = level => `r_2=${getR2(level)}`
        r2 = theory.createUpgrade(1100, currency, new ExponentialCost(settings.q_terms_costs[0], Math.log2(1.7)))
        r2.getDescription = _ => Utils.getMath(getDesc(r2.level))
        r2.getInfo = amount => Utils.getMathTo(getInfo(r2.level), getInfo(r2.level + amount))
    }

    {
        const getDesc = level => `c=${getC(level).toString(0)}`
        c = theory.createUpgrade(10000, currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
        c.getDescription = _ => Utils.getMath(getDesc(c.level))
        c.getInfo = amount => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount))
    }

    {
        const getDesc = level => `t_1=\\frac{${getCMultiplier(level).toString(0)}}{${settings.t1_decay_rate}^{${level}}}`
        const getInfo = level => `t_1=${getT1(level)}`
        t1 = theory.createUpgrade(20000, currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
        t1.getDescription = _ => Utils.getMath(getDesc(t1.level))
        t1.getInfo = amount => `${Utils.getMathTo(getDesc(t1.level), getDesc(t1.level + amount))} (${Utils.getMathTo(getInfo(t1.level), getInfo(t1.level + amount))})`
    }

    /////////////////////
    // Permanent Upgrades

    default_perm_upgrades.publications = theory.createPublicationUpgrade(0, currency, 1e8)
    default_perm_upgrades.buy_all = theory.createBuyAllUpgrade(1, currency, 1e9)
    default_perm_upgrades.auto_buyer = theory.createAutoBuyerUpgrade(2, currency, 1e15)

    {
        auto_reset = theory.createPermanentUpgrade(100, currency, new ConstantCost(BigNumber.TEN.pow(100)))
        auto_reset.description = Utils.getMath(`\\text{Automatic }t\\text{ resetter}`)
        auto_reset.info = Utils.getMathTo(`\\dot{t}=c-t,\\, t \\ge c\\quad`,`\\quad\\dot{t}=-t,\\, t \\ge c`)
        auto_reset.maxLevel = 1
    }

    {
        unlock_q_terms = theory.createPermanentUpgrade(1000, currency, new CustomCost(
            level => {
                return settings.q_terms_costs[level] ?? BigNumber.ZERO
            }
        ))
        unlock_q_terms.getDescription = _ => unlock_q_terms.level >= 1 ? Localization.getUpgradeAddTermDesc(`g(t)`) : Localization.getUpgradeAddTermDesc(`r_2`)
        unlock_q_terms.getInfo = _ => unlock_q_terms.level >= 1 ? Localization.getUpgradeAddTermInfo(`g(t)`) : Localization.getUpgradeAddTermInfo(`r_2`)
        unlock_q_terms.maxLevel = 2
    }

    {
        display_ft = theory.createPermanentUpgrade(10000, currency, new FreeCost())
        display_ft.getDescription = _ => !displaying_ft ? Utils.getMath(`\\text{Display }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Display }\\rho\\text{ on graph}`)
        display_ft.getInfo = _ => !displaying_ft ? Utils.getMath(`\\text{Displays }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Displays }\\rho\\text{ on graph}`)
        display_ft.bought = _ => {
            display_ft.level = 0
            display_gt.level = 0
            displaying_ft = !displaying_ft
            theory.clearGraph()
        }
    }

    {
        display_gt = theory.createPermanentUpgrade(10001, currency, new FreeCost())
        display_gt.getDescription = _ => !displaying_gt ? Utils.getMath(`\\text{Display }g(t)\\text{ on graph}`) : Utils.getMath(`\\text{Display }\\rho\\text{ on graph}`)
        display_gt.getInfo = _ => !displaying_gt ? Utils.getMath(`\\text{Displays }g(t)\\text{ on graph}`) : Utils.getMath(`\\text{Displays }\\rho\\text{ on graph}`)
        display_gt.bought = _ => {
            display_gt.level = 0
            displaying_ft = false
            displaying_gt = !displaying_gt
            theory.clearGraph()
        }
    }

    {
        const multiplier = BigNumber.TEN.sqrt()
        refund_t1 = theory.createPermanentUpgrade(10100, currency, new FirstFreeCost(new ExponentialCost(multiplier, multiplier)))
        refund_t1.getDescription = _ => Localization.getUpgradeDecCustomDesc(`t_1\\text{ level}`, 1)
        refund_t1.getInfo = _ => Localization.getUpgradeDecCustomInfo(`t_1\\text{ level}`, 1)
        refund_t1.bought = _ => {
            if (t1.level <= 0) {
                refund_t1.level--
                currency.value += refund_t1.cost.getCost(refund_t1.level)
                return
            }
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

    theory.setMilestoneCost(new CustomCost(
        level => {
            return BigNumber.from((settings.milestones[level] ?? 0) * settings.tau_rate)
        }
    ))

    {
        unlock_q = theory.createMilestoneUpgrade(100, 1)
        unlock_q.getDescription = _ => Localization.getUpgradeUnlockDesc(`q`)
        unlock_q.getInfo = _ => Localization.getUpgradeUnlockInfo(`q`)
        unlock_q.canBeRefunded = isQRefundable
    }

    {
        increase_drho_multi = theory.createMilestoneUpgrade(200, 1)
        increase_drho_multi.getDescription = _ => Localization.getUpgradeMultCustomDesc(`\\dot{\\rho}`, settings.milestone_drho_multi)
        increase_drho_multi.getInfo = _ => Localization.getUpgradeMultCustomInfo(`\\dot{\\rho}`, settings.milestone_drho_multi)
    }

    {
        increase_dq_multi = theory.createMilestoneUpgrade(300, 1)
        increase_dq_multi.getDescription = _ => Localization.getUpgradeMultCustomDesc(`\\dot{q}`, settings.milestone_dq_multi)
        increase_dq_multi.getInfo = _ => Localization.getUpgradeMultCustomInfo(`\\dot{q}`, settings.milestone_dq_multi)
    }
    
    /////////////////
    //// Achievements

    ///////////////////
    //// Story chapters

    updateAvailability()
}

var updateAvailability = () => {
    r1.isAvailable = isR1Available()
    r2.isAvailable = isR2Available()

    unlock_q_terms.isAvailable = isQUnlocked()
    increase_drho_multi.isAvailable = increase_dq_multi.isAvailable = isQUnlocked()

    display_ft.isAvailable = !displaying_gt
    display_gt.isAvailable = !displaying_ft
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = BigNumber.from(theory.publicationMultiplier)

    time += time >= getC(c.level) ? (auto_reset.level >= 1 ? -time : (getC(c.level) - time)) : (dt * getT1(t1.level))
    time = time.min(getC(c.level))
    ft = getFtValue(time)
    gt = getGtValue(time)
    drho = bonus * getBaseDotRho() * (isDotRhoMultiplied() ? settings.milestone_drho_multi : 1)
    dq = getBaseDotQ() * (isDotQMultiplied() ? settings.milestone_dq_multi : 1)

    try {
        currency.value += dt * drho
        q += dt * dq
        q = q.max(BigNumber.ONE)
    } catch (exception) {
        throw new Error(`Error:\n${exception}\n\nDebug:\n${dt},${drho},${currency.value},${getFtValue(time)},${getGtValue(time)}`)
    }

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()

    updateAvailability()
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = isR1Available() ? 45 : 25
    const result = [
        `\\dot{\\rho}=${isDotRhoMultiplied() ? String(settings.milestone_drho_multi) : ``}q_1q_2${isQUnlocked() ? `q^{0.5}` : ``}f(t)`
    ]
    if (isR1Available()) result.push(`\\dot{q}=\\frac{${isDotQMultiplied() ? String(settings.milestone_dq_multi) : ``}r_1${isR2Available() ? `r_2` : ``}${isGtAvailable() ? `g(t)` : ``}}{q}`)
    return `\\begin{array}{c} ${result.join(`,\\quad `)} \\end{array}`
}
var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 92
    const result = [
        `${theory.latexSymbol}=\\max{\\rho${settings.tau_rate != 1 ? `^{${settings.tau_rate}}` : ``}}`,
        `\\dot{t}=\\begin{cases}t_1, & t<c\\\\${auto_reset.level >= 1 ? `-t` : `c-t`}, & t\\ge c\\end{cases}`,
        `f(t)=\\frac{(c-t)\\sqrt{t}}{c}${isGtAvailable() ? `,\\quad g(t)=\\frac{1}{t}\\int^t_0f(t)dt` : ``}`
    ]
    return `\\begin{array}{c} ${result.join(`\\\\`)} \\end{array}`
}
var getTertiaryEquation = () => {
    const result = [
        `\\dot{\\rho}=${drho}`,
        `t=${time.toString(1)}`,
        `f(t)=${ft}`
    ]
    const q_row = [
        `q=${q}`,
        `\\dot{q}=${dq}`
    ]
    if (isGtAvailable()) q_row.push(`g(t)=${gt}`)

    let result_string = result.join(",\\quad ")
    if (isQUnlocked()) result_string += `\\\\${q_row.join(`,\\quad `)}`
    return `\\begin{array}{c} ${result_string} \\end{array}`
}

var getPublicationMultiplier = tau => (tau / BigNumber.TEN.pow(settings.publication_divide_power * settings.tau_rate)).pow(0.15 / settings.tau_rate)
var getPublicationMultiplierFormula = symbol => `(\\frac{${symbol}}{10^{${settings.publication_divide_power * settings.tau_rate}}})^{${0.15 / settings.tau_rate}}`

var getCurrencyFromTau = tau => [tau.max(BigNumber.ONE).pow(BigNumber.ONE / settings.tau_rate), currency.symbol]
var getTau = () => currency.value.pow(settings.tau_rate)
var get2DGraphValue = () => {
    if (displaying_ft) return getFtDisplay(time)
    if (displaying_gt) return getGtDisplay(time)
    return currency.value.sign * (1 + currency.value.abs()).log10().toNumber()
}

var getQ1 = level => Utils.getStepwisePowerSum(level, 2, 8, 0)
var getQ2 = level => BigNumber.TWO.pow(level)
var getR1 = level => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getR2Exponent = level => BigNumber.ONE * 0.3 * level
var getR2 = level => BigNumber.THREE.pow(getR2Exponent(level))
var getC = level => 100 * getCMultiplier(level)
var getCMultiplier = level => Utils.getStepwisePowerSum(level + 1, 2.5, 10, 0)
var getT1 = level => getCMultiplier(level) / BigNumber.from(settings.t1_decay_rate).pow(level)

var isR1Available = () => {
    return isQUnlocked()
}
var isR2Available = () => {
    return unlock_q_terms.level >= 1 && unlock_q_terms.isAvailable
}
var isGtAvailable = () => {
    return unlock_q_terms.level >= 2 && unlock_q_terms.isAvailable
}
var isDotRhoMultiplied = () => {
    return increase_drho_multi.level >= 1
}
var isDotQMultiplied = () => {
    return increase_dq_multi.level >= 1
}
var isQUnlocked = () => {
    return unlock_q.level >= 1
}
var isQRefundable = () => {
    return increase_drho_multi.level == 0 && increase_dq_multi.level >= 0
}

var getBaseDotRho = () => {
    return getQ1(q1.level) * getQ2(q2.level) * q.sqrt() * getFtValue(time)
}
var getBaseDotQ = () => {
    if (unlock_q.level < 1) return BigNumber.ZERO

    const r_1 = isR1Available() ? getR1(r1.level) : BigNumber.ZERO
    const r_2 = isR2Available() ? getR2(r2.level) : BigNumber.ONE
    const gt = isGtAvailable() ? getGtValue(time) : BigNumber.ONE
    return r_1 * r_2 * gt / q
}

var getFtValue = time => (getC(c.level) - time) / getC(c.level) * time.sqrt()
var getGtValue = t => 2 * t.sqrt() / 3 - 2 * t.pow(1.5) / (5 * getC(c.level)) // Expanded form of definite integral

var getFtDisplay = time => {
    const modifier = getC(c.level) / 5
    return ((5 - time / modifier) / 5 * (time / modifier).sqrt()).toNumber()
}
var getGtDisplay = t => {
    const modifier = getC(c.level) / 5
    return (getGtValue(t) / modifier).toNumber()
}

var getInternalState = () => {
    return JSON.stringify({
        time: time.toBase64String(),
        q: q.toBase64String()
    })
}
var setInternalState = string => {
    if (!string) return
    const state = JSON.parse(string)
    
    const time_state = state.time ?? BigNumber.ZERO.toBase64String()
    time = BigNumber.fromBase64String(time_state)
    const q_state = state.q ?? BigNumber.ONE.toBase64String()
    q = BigNumber.fromBase64String(q_state).max(BigNumber.ONE)
}

var postPublish = () => {
    time = BigNumber.ZERO
    q = BigNumber.ONE
}

init()
