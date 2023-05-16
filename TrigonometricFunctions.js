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
/*
    Even though I really wanted to use "let" and "const" instead of "var",
    using them causes an error in the Exponential Idle custom theory API,
    so I'm not using them and it's causing me mental issues
*/

import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs"
import { Localization } from "./api/Localization"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"

var id = "SineExtension"
var name = "Trigonometric Functions"
var description = "Trigonometric Functions by HyperKNF"
var authors = "HyperKNF"
var version = 4

var currency, tcurrency
var t1, t2
var c1, c2, c3
var sa, sg
var unlock

var page = 1

var dtime = BigNumber.from(0)
var drho1 = BigNumber.from(0), drho2 = BigNumber.from(0)

var achievements = [], chapters = []

var init = () => {
    currency = theory.createCurrency()
    currency2 = theory.createCurrency()
    tcurrency = theory.createCurrency("t", "t")

    ///////////////////
    // Regular Upgrades
    
    // t1
    {
        let getDesc = (level) => "t_1=" + getT1(level).toString()
        t1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(100, Math.log2(100))))
        t1.getDescription = (_) => Utils.getMath(getDesc(t1.level))
        t1.getInfo = (amount) => Utils.getMathTo(getDesc(t1.level), getDesc(t1.level + amount))
    } 
    
    // t2
    {
        let getDesc = (level) => "t_2=" + level
        t2 = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(1e5, Math.log2(1e5))))
        t2.getDescription = (_) => Utils.getMath(getDesc(t2.level))
        t2.getInfo = (amount) => Utils.getMathTo(getDesc(t2.level), getDesc(t2.level + amount))
    } 

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0)
        c1 = theory.createUpgrade(2, currency, new FirstFreeCost(new ExponentialCost(15, Math.log2(2))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}"
        let getInfo = (level) => "c_2=" + getC2(level).toString(0)
        c2 = theory.createUpgrade(3, currency, new ExponentialCost(5, Math.log2(10)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }
    
    // c3
    {
        let getDesc = (level) => "c_3=\\frac{\\pi}{" + getC3(level) + "}"
        let getInfo = (level) => "c_3=\\frac{\\pi}{" + getC3(level) + "}"
        c3 = theory.createUpgrade(4, currency, new ExponentialCost(1000, Math.log2(1000)))
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level))
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount))
    }
    
    // sa
    {
        let getDesc = (level) => "S_a=" + getSa(level) + ""
        let getInfo = (level) => "S_a=" + getSa(level) + ""
        sa = theory.createUpgrade(5, currency, new ExponentialCost(1e5, Math.log2(2.5)))
        sa.getDescription = (_) => Utils.getMath(getDesc(sa.level))
        sa.getInfo = (amount) => Utils.getMathTo(getInfo(sa.level), getInfo(sa.level + amount))
    }
    
    // sg
    {
        let getDesc = (level) => "S_\\gamma=" + getSg(level) + "^{\circ}"
        let getInfo = (level) => "S_\\gamma=" + getSg(level) + "^{\circ}"
        sg = theory.createUpgrade(6, currency, new ExponentialCost(1e5, Math.log2(3)))
        sg.getDescription = (_) => Utils.getMath(getDesc(sg.level))
        sg.getInfo = (amount) => Utils.getMathTo(getInfo(sg.level), getInfo(sg.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e2)
    theory.createBuyAllUpgrade(1, currency, 1e14)
    theory.createAutoBuyerUpgrade(2, currency, 1e27)

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new CustomCost((milestone) => {
        return BigNumber.from((() => {
            switch (milestone) {
                case 0:
                    return 0
                case 1:
                    return 20
                case 2:
                    return 50
                case 3:
                    return 115
                case 4:
                    return 190
                default:
                    return 300 + 150 * (milestone - 5)
            }
        })())
    }))

    {
        unlock = theory.createMilestoneUpgrade(0, 1)
        unlock.description = "Unlocks Cosine Theorem"
        unlock.info = "Unlocks Cosine Theorem"
    }
    
    /////////////////
    //// Achievements
    "none"

    ///////////////////
    //// Story chapters
    "none"

    updateAvailability()
}

var updateAvailability = () => {
    sa.isAvailable = sg.isAvailable = unlock.level >= 1
}

var tick = (elapsedTime, multiplier) => {
    function CosineTheorem() {
        var sb = Math.max(getSa(sa), (tcurrency.value / 500))
        var radians = (Math.PI / 180) * getSg(sg)
        return Math.sqrt(getSa(sa) ** 2 + getSb(sb) ** 2 - 2 * getSa(sa) * sb * Math.cos(radians))
    }
    
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier
    dtime = getT1(t1.level) * t2.level
    drho1 = dt * bonus * Math.sqrt(currency2.value) * Math.abs(Math.sin(tcurrency.value)) * (unlock.level >= 1 ? CosineTheorem() : 1)
    drho2 = getC1(c1.level) * getC2(c2.level) * Math.pow((Math.PI / getC3(c3.level)), -(Math.log(tcurrency.value + 1) / Math.log(5)))
    tcurrency.value += dtime
    currency.value += drho1
    currency2.value += drho2
    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    if (page == 1) {
        theory.primaryEquationHeight = 35
        return "\\dot{\\rho_1}=\\mid\\sin{t}\\mid\\sqrt{\\rho_2}"
    } else {
        theory.primaryEquationHeight = 35
        return "c=\\sqrt{a^2+b^2-2ab\\cos{\\gamma}}"
    }
}
var getSecondaryEquation = () => {
    if (page == 1) {
        theory.secondaryEquationHeight = 75
        return "\\dot{t}=t_1t_2\\\\\\dot{\\rho_2}=c_1c_2c_3^{-\\log_{5}{(1+t)}}\\\\" + theory.latexSymbol + "=\\max\\rho_1"
    } else {
        theory.secondaryEquationHeight = 100
        return "a=S_a\\\\\\begin{cases}\\frac{t}{500},\\quad\\frac{t}{500}\\leS_a\\\\S_a,\\quad\\frac{t}{500}>S_a\\end{cases}\\\\\\gamma=S_\\gamma"
    }
}
var getTertiaryEquation = () => {
    if (page == 1) {
        return "\\dot{\\rho_1}\\approx" + drho1.toString(5) + ",\\quad\\dot{\\rho_2}\\approx" + drho2.toString(5)
    } else return "W.I.P."
}

var getPublicationMultiplier = (tau) => tau.pow(0.169)
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{0.169}"
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()
var getT1 = (level) => level / 10
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getC2 = (level) => BigNumber.TWO.pow(level)
var getC3 = (level) => 1 + Utils.getStepwisePowerSum(level, 1.5, 4, 0)
var getSa = (level) => 5 + Utils.getStepwisePowerSum(level, 2, 5, 0)
var getSg = (level) => 90 - 90 * (4 / 5) ** level

var canGoToPreviousStage = () => page == 1;
var goToPreviousStage = () => page--
var canGoToNextStage = () => page == 0
var goToNextStage = () => stage++

init()
