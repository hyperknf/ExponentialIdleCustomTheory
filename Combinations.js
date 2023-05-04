/***************************************************************************
 **                                                                       **
 **      _____                _                _____                      **
 **     / ____|              (_)              / ____|                     **
 **    | |     ___  _ __ ___  _ _ __   __ _  | (___   ___   ___  _ __     **
 **    | |    / _ \| '_ ` _ \| | '_ \ / _` |  \___ \ / _ \ / _ \| '_ \    **
 **    | |___| (_) | | | | | | | | | | (_| |  ____) | (_) | (_) | | | |   **
 **     \_____\___/|_| |_| |_|_|_| |_|\__, | |_____/ \___/ \___/|_| |_|   **
 **                                    __/ |                              **
 **                                   |___/                               ** 
 **                                                                       **
 ***************************************************************************/

import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs"
import { Localization } from "./api/Localization"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"

var id = "Combinations"
var name = "Combinations"
var description = "Combinations by HyperKNF"
var authors = "HyperKNF"
var version = 1

var currency
var c1, c2
var c1Exp, c2Exp

var achievements = [], chapters = []

var factorial = num => {
    var g = 7
    var C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716 * Math.pow(10, -6), 1.5056327351493116 * Math.pow(10, -7)]
    function gamma(z) {
        if (z < 0.5) {
            return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z))
        } else {
            z -= 1
            var x = C[0]
            for (var i = 1; i < g + 2; i++)
            x += C[i] / (z + i)
            var t = z + g + 0.5
            return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x
        }
    }
    return gamma(num + 1)
}

var init = () => {
    currency = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0)
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}";
        let getInfo = (level) => "c_2=" + getC2(level).toString(0)
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(5, Math.log2(10)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10)
    theory.createBuyAllUpgrade(1, currency, 1e13)
    theory.createAutoBuyerUpgrade(2, currency, 1e30)

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25))

    /*{
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }*/
    
    /////////////////
    //// Achievements
    "none"

    ///////////////////
    //// Story chapters
    "none"

    updateAvailability()
}

var updateAvailability = () => {
    // c2Exp.isAvailable = c1Exp.level > 0
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    currency.value += factorial(Math.sqrt(dt * bonus * getC1(c1.level) * getC2(c2.level)))
}

var getPrimaryEquation = () => {
    return "\\dot{\\rho} = sqrt{c_1c_2}!"
}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho"
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}"
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getC2 = (level) => BigNumber.TWO.pow(level)
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level)
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level)
init()
