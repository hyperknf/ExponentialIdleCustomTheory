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

var id = "SineExtension"
var name = "Extension of Sine"
var description = "Extension of Sine by HyperKNF"
var authors = "HyperKNF"
var version = 1

var currency, tcurrency
var t1
var c1, c2, c3
var c1Exp, c2Exp

var achievements = [], chapters = []

var init = () => {
    currency = theory.createCurrency()
    tcurrency = theory.createCurrency("t", "t")

    ///////////////////
    // Regular Upgrades
    
    // t
    {
        let getDesc = (level) => "t_1=" + getT1(level).toString()
        t1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(100, Math.log2(100))))
        t1.getDescription = (_) => Utils.getMath(getDesc(t1.level))
        t1.getInfo = (amount) => Utils.getMathTo(getDesc(t1.level), getDesc(t1.level + amount))
    } 

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0)
        c1 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}"
        let getInfo = (level) => "c_2=" + getC2(level).toString(0)
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(5, Math.log2(10)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }
    
    // c3
    {
        let getDesc = (level) => "c_3=\\frac{\\pi}{" + getC3(level) + "}"
        let getInfo = (level) => "c_3=\\frac{\\pi}{" + getC3(level).toString(0) + "}"
        c3 = theory.createUpgrade(3, currency, new ExponentialCost(1000, Math.log2(1000)))
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level))
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10)
    theory.createBuyAllUpgrade(1, currency, 1e17)
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
    
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier
    tcurrency.value += getT1(t1.level)
    currency.value += dt * bonus * getC1(c1.level) * getC2(c2.level) * ((Math.PI / getC3(c3.level)) ** (Math.log(tcurrency.value) / Math.log(5))) * (1 + Math.sin(tcurrency.value))
}

var getPrimaryEquation = () => {
    let result = "\\dot{\\rho} = c_1"

    result += "c_2c_3^{-\\log_{5}{1+t}}(1+\\sin{t})"

    return result
}

var getSecondaryEquation = () => "\\dot{t}=t_1\\\\" + theory.latexSymbol + "=\\max\\rho"
var getPublicationMultiplier = (tau) => tau.pow(0.169)
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{0.169}"
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()
var getT1 = (level) => level / 10
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getC2 = (level) => BigNumber.TWO.pow(level)
var getC3 = (level) => 1 + Utils.getStepwisePowerSum(level, 1.5, 4, 0)
init()
