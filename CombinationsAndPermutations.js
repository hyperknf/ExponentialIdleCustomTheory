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
var c1, c2, n1, n2, n3, r1, r2
var unlock

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level)
        let getInfo = (level) => "c_1=" + getC1(level)
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(5))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level)
        let getInfo = (level) => "c_2=" + getC2(level)
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(50, Math.log2(25)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }
    
    // n1
    {
        let getDesc = level => "n_1=" + getN1(level)
        let getInfo = getDesc
        n1 = theory.createUpgrade(2, currency, new ExponentialCost(10, Math.log2(10)))
        n1.getDescription = () => Utils.getMath(getDesc(n1.level))
        n1.getInfo = amount => Utils.getMathTo(getInfo(n1.level), getInfo(n1.level + amount))
    }

    // n2
    {
        let getDesc = level => "n_2=" + getN2(level)
        let getInfo = getDesc
        n2 = theory.createUpgrade(3, currency, new ExponentialCost(10, Math.log2(10)))
        n2.getDescription = () => Utils.getMath(getDesc(n2.level))
        n2.getInfo = amount => Utils.getMathTo(getInfo(n2.level), getInfo(n2.level + amount))
    }

    // n3
    {
        let getDesc = level => "n_3=" + getN3(level)
        let getInfo = getDesc
        n3 = theory.createUpgrade(4, currency, new ExponentialCost(10, Math.log2(10)))
        n3.getDescription = () => Utils.getMath(getDesc(n3.level))
        n3.getInfo = amount => Utils.getMathTo(getInfo(n3.level), getInfo(n3.level + amount))
    }

    // r1
    {
        let getDesc = level => "r_1=" + getR1(level)
        let getInfo = getDesc
        r1 = theory.createUpgrade(5, currency, new ExponentialCost(50, Math.log2(100)))
        r1.getDescription = () => Utils.getMath(getDesc(r1.level))
        r1.getInfo = amount => Utils.getMathTo(getInfo(r1.level), getInfo(r1.level + amount))
    }

    // r2
    {
        let getDesc = level => "r_2=" + getR2(level)
        let getInfo = getDesc
        r2 = theory.createUpgrade(6, currency, new ExponentialCost(50, Math.log2(100)))
        r2.getDescription = () => Utils.getMath(getDesc(r2.level))
        r2.getInfo = amount => Utils.getMathTo(getInfo(r2.level), getInfo(r2.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e7)
    theory.createBuyAllUpgrade(1, currency, 1e15)
    theory.createAutoBuyerUpgrade(2, currency, 1e30)

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25))
    
    // unlock
    {
        unlock = theory.createMilestoneUpgrade(0, 3)
        unlock.description = "Unlock Combinations"
        unlock.info = "Unlocks Combinations"
    }

    "NONE CURRENTLY"

    // NO ACHIEVEMENTS OR STORY CHAPTERS
}

function integerFactorial(number) {
    number = BigNumber.from(number)
    if (number <= 1) return 1
    return number * integerFactorial(number - 1)
}

function combinations(n, r) {
    return integerFactorial(n) / (integerFactorial(r) * integerFactorial(n - r))
}

function permutations(n, r) {
    return integerFactorial(n) / integerFactorial(n - r)
}

function binomialTheorem(x, y, n) {
    let result = 0
    for (let i = 0; i <= n; i++) result += combinations(n, i) * x.pow(i) * y.pow(n - i)
    return BigNumber.from(result)
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier
    currency.value += dt * bonus * getC1(c1.level) * getC2(c2.level) * (
        unlock.level >= 1 ? combinations(getN1(n1.level), getR1(r1.level)) : 1
    ) * (
        unlock.level >= 2 ? combinations(getN2(n2.level), getR2(r2.level)) : 1
    ) * (
        unlock.level >= 3 ? binomialTheorem(getC1(c1.level), getC2(c2.level), getN3(n3.level)) : 1
    )
    
    unlock.description = unlock.level == 1 ? "Unlock Permutations" : unlock.level >= 2 ? "Unlock Binomial Theorem" : "Unlock Combinations"
    unlock.info = unlock.level == 1 ? "Unlocks Permutations" : unlock.level >= 2 ? "Unlocks Binomial Theorem" : "Unlocks Combinations"

    n1.isAvailable = unlock.level >= 1
    n2.isAvailable = unlock.level >= 2
    n3.isAvailable = unlock.level >= 3
    r1.isAvailable = unlock.level >= 1
    r2.isAvailable = unlock.level >= 2

    r1.maxLevel = Math.floor(n1.level / 2)
    r2.maxLevel = Math.floor(n2.level / 2)
}

var getPrimaryEquation = () => {
    theory.primaryEquationHeight = 50
    let result = "\\dot{\\rho}="
    if (unlock.level >= 1) result += "C^{n_1}_{r_1}"
    if (unlock.level >= 2) result += "P^{n_2}_{r_2}"
    if (unlock.level >= 3) result += "\\sum^{n_3}_kC^{n_3}_kx^ky^{{n_3}-k}"
    result += unlock.level >= 3 ? "(c_1c_2)^{n_3}" : "c_1c_2"
    return result
}
var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho^{0.1}"
var getPublicationMultiplier = (tau) => tau.pow(2) / BigNumber.THREE
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{2}}{3}"
var getTau = () => currency.value.pow(0.1)
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 5, 0)
var getC2 = (level) => BigNumber.from(2).pow(level)
var getR1 = level => BigNumber.from(level)
var getR2 = level => BigNumber.from(level)
var getN1 = level => BigNumber.from(level)
var getN2 = level => BigNumber.from(level)
var getN3 = level => BigNumber.from(level)

init()