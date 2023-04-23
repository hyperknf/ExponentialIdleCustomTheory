import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";

import { Localization } from "./api/Localization";

import { BigNumber } from "./api/BigNumber";

import { theory } from "./api/Theory";

import { Utils } from "./api/Utils";

var id = "HyperKNF_Exponential";

var name = "Exponential";

var description = "Exponential";

var authors = "HyperKNF";

var version = 6;

var currency;

var c1, c2, c3, c4, k1, k2, k3;

var c1Exp, c2Exp;

var achievement1;

var chapter1, chapter2;

var init = () => {

    currency = theory.createCurrency();

    ///////////////////

    // Regular Upgrades

    // c1

    {

        let getDesc = (level) => "c_1=" + getC1(level).toString(0);

        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2))));

        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));

        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));

    }

    // c2

    {

        let getDesc = (level) => "c_2=2^{" + level + "}";

        let getInfo = (level) => "c_2=" + getC2(level).toString(0);

        c2 = theory.createUpgrade(1, currency, new ExponentialCost(25, Math.log2(50)));

        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));

        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));

    }
    
    // c3

    {

        let getDesc = (level) => "c_3=3^{" + level + "}";

        let getInfo = (level) => "c_3=" + getC3(level).toString(0);

        c3 = theory.createUpgrade(2, currency, new ExponentialCost(100, Math.log2(75)));

        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level));

        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount));

    }
    
    // c4

    {

        let getDesc = (level) => "c_4={" + level + "}";

        let getInfo = (level) => `c_4=${level}`;

        c4 = theory.createUpgrade(3, currency, new ExponentialCost(50, Math.log2(100)));

        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level));

        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount));

    }
    
    // k1

    {

        let getDesc = (level) => "k_1=" + level;

        let getInfo = (level) => `k_1=${level}`;

        k1 = theory.createUpgrade(4, currency, new ExponentialCost(25, Math.log2(2)));

        k1.getDescription = (_) => Utils.getMath(getDesc(k1.level));

        k1.getInfo = (amount) => Utils.getMathTo(getInfo(k1.level), getInfo(k1.level + amount));

    }
    
    // k2

    {

        let getDesc = (level) => "k_2=" + (1 + level);

        let getInfo = (level) => `k_2=${level}`;

        k2 = theory.createUpgrade(5, currency, new ExponentialCost(10, Math.log2(1.5)));

        k2.getDescription = (_) => Utils.getMath(getDesc(k2.level));

        k2.getInfo = (amount) => Utils.getMathTo(getInfo(k2.level), getInfo(k2.level + amount));

    }
    
    // k3

    {

        let getDesc = (level) => "k_3=" + level;

        let getInfo = (level) => `k_3=${level}`;

        k3 = theory.createUpgrade(6, currency, new ExponentialCost(10, Math.log2(1.5)));

        k3.getDescription = (_) => Utils.getMath(getDesc(k3.level));

        k3.getInfo = (amount) => Utils.getMathTo(getInfo(k3.level), getInfo(k3.level + amount));

    }

    /////////////////////

    // Permanent Upgrades

    theory.createPublicationUpgrade(0, currency, 1e25);

    theory.createBuyAllUpgrade(1, currency, 1e50);

    theory.createAutoBuyerUpgrade(2, currency, 1e100);

    ///////////////////////

    //// Milestone Upgrades

    theory.setMilestoneCost(new LinearCost(25, 25));

    {

        c1Exp = theory.createMilestoneUpgrade(0, 3);

        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05");

        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05");

        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();

    }

    {

        c2Exp = theory.createMilestoneUpgrade(1, 3);

        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05");

        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05");

        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation();

    }

    

    /////////////////

    //// Achievements

    achievement1 = theory.createAchievement(0, "The start of chaos", "The start of something bad...", () => c1.level > 1);
    
    achievement2 = theory.createAchievement(1, "Exponential constant", "You found out about the exponential constant", () => k1.level > 1)

    ///////////////////

    //// Story chapters

    chapter1 = theory.createStoryChapter(0, "e", "You started to find out\nthat as k approaches infinity\n(1 + 1/k)^k approaches e\nMaybe this will be useful in your research?", () => k.level > 0);

    updateAvailability();

}

var updateAvailability = () => {

    c2Exp.isAvailable = c1Exp.level > 0;

}

var tick = (elapsedTime, multiplier) => {
    
    updateAvailability()

    let dt = BigNumber.from(elapsedTime * multiplier);

    let bonus = theory.publicationMultiplier;

    currency.value += 2 / (2 ** (1 + k2.level) - Math.PI ** (k3.level)) * (1 + 1 / (k1.level + 1)) ** (k1.level + 1) * dt * bonus * getC1(c1.level).pow(getC1Exponent(c1Exp.level)) *

                                   getC2(c2.level).pow(getC2Exponent(c2Exp.level)) * getC3(c3.level) * BigNumber.from(Math.E).pow(c4.level);

}

var getPrimaryEquation = () => {

    let result = `\\dot{\\rho} = (\\frac{2}{2^{k_2}-\\pi^{k_3}})(1+\\frac{1}{k+1})^{k+1}c_1`;

    if (c1Exp.level == 1) result += "^{1.05}";

    if (c1Exp.level == 2) result += "^{1.1}";

    if (c1Exp.level == 3) result += "^{1.15}";

    result += "c_2";

    if (c2Exp.level == 1) result += "^{1.05}";

    if (c2Exp.level == 2) result += "^{1.1}";

    if (c2Exp.level == 3) result += "^{1.15}";

    return result + "c_{3}e^{c_4}";

}

var getSecondaryEquation = () => theory.latexSymbol + "=\\max\\rho";

var getPublicationMultiplier = (tau) => tau.pow(0.01) / BigNumber.THREE;

var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.01}}{3}";

var getTau = () => currency.value;

var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0);

var getC2 = (level) => BigNumber.TWO.pow(level);

var getC3 = (level) => BigNumber.THREE.pow(level)

var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level);

var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level);

init();
