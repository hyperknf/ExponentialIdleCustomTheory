import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { Localization } from "./api/Localization";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "SomeFunctions";
var name = "Some Functions";
var description = "Some Functions by HyperKNF";
var authors = "HyperKNF";
var version = 1;

var currency;
var k, c1, c2, q1, q2;
var c1Exp, c2Exp;

var q = BigNumber.ONE

var achievement1, achievement2;
var chapter1, chapter2;

var init = () => {
    currency = theory.createCurrency();

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level);
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount));
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level);
        c1 = theory.createUpgrade(1, currency, new ExponentialCost(15, Math.log2(2)));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level);
        let getInfo = (level) => "c_2=" + getC2(level);
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(5, Math.log2(10)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // q1
    {
        let getDesc = (level) => "q_1=" + getC1(level);
        q1 = theory.createUpgrade(3, currency, new ExponentialCost(15, Math.log2(2)));
        q1.getDescription = (_) => Utils.getMath(getDesc(q1.level));
        q1.getInfo = (amount) => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount));
    }

    // q2
    {
        let getDesc = (level) => "q_2=2^{" + level + "}";
        q2 = theory.createUpgrade(4, currency, new ExponentialCost(50, Math.log2(2)));
        q2.getDescription = (_) => Utils.getMath(getDesc(q2.level));
        q2.getInfo = (amount) => Utils.getMathTo(getDesc(q2.level), getDesc(q2.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(25, 25));
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Achievement 1", "Description 1", () => c1.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Achievement 2", "Description 2", "Maybe you should buy two levels of c2?", () => c2.level > 1);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0);

    updateAvailability();
}

var updateAvailability = () => {
  
}

var postPublish = () => q = BigNumber.ONE

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;
    q += dt * getQ1(q1.level) * getQ2(q2.level) / q
    currency.value += dt * bonus * getK(k.level) * q * getC1(c1.level) ** getC2(c2.level)

    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    result = "\\dot{\\rho}=kqc_1^{c_2}"

    return result;
}
var getSecondaryEquation = () => "\\dot{q}=\\frac{q_1q_2}{q}"
var getTertiaryEquation = () => "q=" + q
var getPublicationMultiplier = (tau) => tau.pow(0.164) / BigNumber.THREE;
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.164}}{3}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getK = level => Utils.getStepwisePowerSum(level, 2, 5, 0)
var getC1 = level => 1 + 0.5 * level
var getC2 = level => 1 + 0.25 * level
var getQ1 = level => Utils.getStepwisePowerSum(level, 2, 5, 0)
var getQ2 = level => BigNumber.TWO.pow(level)

init();
