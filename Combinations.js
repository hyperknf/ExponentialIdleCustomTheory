import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs"
import { Localization } from "./api/Localization"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"

var id = "CombinationsAndPermutations"
var name = "Combinations and Permutations"
var description = "Combinations and Permutations by HyperKNF"
var authors = "HyperKNF"
var version = 1

var currency
var c1, c2, n, k

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0)
        let getInfo = (level) => "c_1=" + getC1(level).toString(0)
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(5))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(0)
        let getInfo = (level) => "c_2=" + getC2(level).toString(0)
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(50, Math.log2(25)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }
    
    // n
    {
        let getDesc = level => "n=" + getN(level).toString(0)
        let getInfo = getDesc
        n = theory.createUpgrade(2, currency, new ExponentialCost(10, Math.log2(10)))
        n.getDescription = () => Utils.getMath(getDesc(n.level))
        n.getInfo = amount => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount))
    }

    // k
    {
        let getDesc = level => "k=" + getK(level).toString(0)
        let getInfo = getDesc
        n = theory.createUpgrade(3, currency, new ExponentialCost(50, Math.log2(100)))
        n.getDescription = () => Utils.getMath(getDesc(n.level))
        n.getInfo = amount => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10)
    theory.createBuyAllUpgrade(1, currency, 1e13)
    theory.createAutoBuyerUpgrade(2, currency, 1e30)

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25))

    "NONE CURRENTLY"

    // NO ACHIEVEMENTS OR STORY CHAPTERS

    updateAvailability()
}

var integerFactorial = (number) => {
    if (number <= 1) return 1
    return number * integerFactorial(number - 1)
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier
    currency.value += dt * bonus * 0
}

var getPrimaryEquation = () => {
    return "\\dot{\\rho}=c_1c_2\\sum^n_kC^n_kx^ky^{n-k}"
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}"
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.log10()

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 0)
var getC2 = (level) => BigNumber.from(2).pow(BigNumber.from(level))
var getN = level => level
var getK = level => level
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level)
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level)

init()