import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "MoneySimulator";
var name = "Money Simulator";
var description = "Money Simulator by HyperKNF";
var authors = "HyperKNF";
var version = 1;

var currency
var energy_generator

var time = 0

var init = () => {
    currency = theory.createCurrency("\\$", "\\$")

    ///////////////////
    // Regular Upgrades

    // Energy Generators
    {
        let getDesc = (level) => "\\text{Energy generator(s)}:\\quad " + getEnergyGenerators(level).toString(0)
        energy_generator = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))))
        energy_generator.getDescription = (_) => Utils.getMath(getDesc(energy_generator.level))
        energy_generator.getInfo = (amount) => `Gives ${amount} energy generators`
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10)
    theory.createBuyAllUpgrade(1, currency, 1e13)
    theory.createAutoBuyerUpgrade(2, currency, 1e30)

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25))

    /*
    {
        c1Exp = theory.createMilestoneUpgrade(0, 3);
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05")
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();
    }

    {
        c2Exp = theory.createMilestoneUpgrade(1, 3);
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05")
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05")
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation()
    }
    */
    
    /////////////////
    //// Achievements
    /*
    achievement1 = theory.createAchievement(0, "Achievement 1", "Description 1", () => c1.level > 1)
    achievement2 = theory.createSecretAchievement(1, "Achievement 2", "Description 2", "Maybe you should buy two levels of c2?", () => c2.level > 1)
    */

    ///////////////////
    //// Story chapters
    /*
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0)
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0)
    */

    updateAvailability()
}

var updateAvailability = () => {
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier

    time++
    if (time % 10 == 0) {
        currency.value += getIncome(bonus)
    }
}

var getPrimaryEquation = () => {
    return "\\text{Energy generators give 1$}"
}
var getTertiaryEquation = () => {
    return `\\text{Income:}\\quad ${getIncome(theory.publicationMultiplier)}$`
}

var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}"
var getTau = () => currency.value
var get2DGraphValue = () => currency.value.sign * (1 + currency.value.abs()).log10()

var getIncome = bonus => {
    return (
        bonus *
        getEnergyGenerators(energy_generator.level)
    )
}

var getEnergyGenerators = level => level

init()
