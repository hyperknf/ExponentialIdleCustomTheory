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
var q1, q2
var reset_time

var time = BigNumber.ZERO

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    // Energy Generators
    {
        const getDesc = level => `q_1=${getQ1(level)}`
        q1 = theory.createUpgrade(100, currency, new FirstFreeCost(new ExponentialCost(BigNumber.FIVE, Math.log2(2))))
        q1.getDescription = _ => Utils.getMath(getDesc(q1.level))
        q1.getInfo = amount => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount))
    }

    {
        const getDesc = level => `q_2=2^{${level}}`
        const getInfo = level => `q_2=${getQ2(level)}`
        q2 = theory.createUpgrade(200, currency, new FirstFreeCost(new ExponentialCost(BigNumber.TEN, Math.log2(10))))
        q2.getDescription = _ => Utils.getMath(getDesc(q2.level))
        q2.getInfo = amount => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e8)
    theory.createBuyAllUpgrade(1, currency, 1e9)
    theory.createAutoBuyerUpgrade(2, currency, 1e15)

    ////////////////////
    // Singular Upgrades

    {
        const getDesc = () => `Reset ${Utils.getMath("t")}`
        const getInfo = () => `Resets ${Utils.getMath("t")}`
        reset_time = theory.createSingularUpgrade(0, currency, new FreeCost())
        reset_time.getDescription = getDesc
        reset_time.getInfo = getInfo
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

    time += dt
    currency.value += dt * bonus * time * getQ1(q1.level) * getQ2(q2.level) * getLogisticValue(time)

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 35
    return `\\dot{\\rho}=tq_1q_2(\\frac{60-t}{60})`
}
var getSecondaryEquation = () => {
    theory.secondaryEquationHeight = 45
    const result = [
        `${theory.latexSymbol}=\\max{\\rho}`,
        `\\dot{t}=\\begin{cases}1, & t<c\\\\t-60, & t\\ge c\\end{cases}`
    ]
    return `\\begin{array}{c} ${result.join(`\\\\`)} \\end{array}`
}
var getTertiaryEquation = () => {
    return ``
}

var getPublicationMultiplier = (tau) => tau.pow(0.15)
var getPublicationMultiplierFormula = (symbol) => `${symbol}^{}-.15`
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (1 + currency.value.abs()).log10().toNumber()

var getQ1 = level => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getQ2 = level => BigNumber.TWO.pow(level)

var getLogisticValue = time => (BigNumber.SIX * BigNumber.TEN - time).max(BigNumber.ZERO) / (BigNumber.SIX * BigNumber.TEN)

init()
