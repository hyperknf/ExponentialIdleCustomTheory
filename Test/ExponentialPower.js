import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { BigNumber } from "./api/BigNumber";
import { theory } from "./api/Theory";
import { Utils } from "./api/Utils";

var id = "ExponentialPowerTest";
var name = "Exponential Power (Test)";
var description = "Exponential Power by HyperKNF";
var authors = "HyperKNF";
var version = 2;

var currency;
var k, n, c1, c2, x1;
var unlock

var achievement1, achievement2;
var chapter1, chapter2;

var page = 0
var E = BigNumber.E

var tertiary_display = Array.from({
    length: 2
}, () => BigNumber.from(0))

var getStepwisePowerProduct = (level, base, step_length, offset) => {
    if (offset != 0) throw new Error("I don't know how to implement non-zero offset :)")
    
    const step = Math.floor(level / step_length)
    const levels = level % step_length
    const exponents = Array.from({
        length: step
    }, () => step_length)
    exponents.push(levels)
    const product = exponents.reduce(
        (product, value, index) => {
            return product * BigNumber.from(base).pow(index + 1).pow(value)
        }, 1
    )
    return product
}

var init = () => {
    currency = theory.createCurrency();
    currency.value += 1e20

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level);
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount));
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level);
        n = theory.createUpgrade(1, currency, new FirstFreeCost(new ExponentialCost(1e20, Math.log2(2.5))));
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level);
        c1 = theory.createUpgrade(2, currency, new CustomCost(
            level => 15 * getStepwisePowerProduct(level, 2, 50, 0)
        ));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level);
        let getInfo = (level) => "c_2=" + getC2(level);
        c2 = theory.createUpgrade(3, currency, new ExponentialCost(50, Math.log2(10)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // x1
    {
        let getDesc = level => "x_1=" + getX1(level)
        x1 = theory.createUpgrade(4, currency, new ExponentialCost(1e20, Math.log2(50)))
        x1.getDescription = _ => Utils.getMath(getDesc(x1.level))
        x1.getInfo = amount => Utils.getMathTo(getDesc(x1.level), getDesc(x1.level + amount))
    }
    
    // x1
    {
        let getDesc = level => "x_2=" + getX2(level)
        let getInfo = level => "x_2=e^{" + getX2Exponent(level) + "}"
        x2 = theory.createUpgrade(5, currency, new ExponentialCost(1e40, Math.log2(10 ** 2.5)))
        x2.getDescription = _ => Utils.getMath(getDesc(x2.level))
        x2.getInfo = amount => Utils.getMathTo(getInfo(x2.level), getInfo(x2.level + amount))
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new LinearCost(20, 20));

    { 
        unlock = theory.createMilestoneUpgrade(0, 3); 
        unlock.description = "$\\text{Unlock }E$" 
        unlock.info = "$\\text{Unlocks }E$"
    }
    
    /////////////////
    //// Achievements
    achievement1 = theory.createAchievement(0, "Achievement 1", "Description 1", () => c1.level > 1);
    achievement2 = theory.createSecretAchievement(1, "Achievement 2", "Description 2", "Maybe you should buy two levels of c2?", () => c2.level > 1);

    ///////////////////
    //// Story chapters
    chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0);
    chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0);
}

var updateMilestoneUpgradeInfo = () => {
    unlock.description =
        unlock.level == 0 ? "$\\text{Unlock }E$" :
        unlock.level == 1 ? "$\\text{Unlock }x_1$" :
        "$\\text{Unlock }x_2$"
    unlock.info =
        unlock.level == 0 ? "$\\text{Unlocks }E$" :
        unlock.level == 1 ? "$\\text{Unlocks }x_1$" :
        "$\\text{Unlocks }x_2$"
}

var updateAvailability = () => {
    n.isAvailable = unlock.level >= 1
    x1.isAvailable = unlock.level >= 2
    x2.isAvailable = unlock.level >= 3
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    E = BigNumber.E - (BigNumber.ONE + BigNumber.ONE / getN(n.level)).pow(getN(n.level))
    
    currency.value += dt * bonus * getK(k.level) * (
        unlock.level >= 1 ? E.pow(-1) : 1
    ) * (tertiary_display[0] = BigNumber.from(getC1(c1.level) ** (getC2Balance(getC2(c2.level)) * (
        unlock.level >= 2 ? getX1(x1.level) : 1
    )))) * (
        unlock.level >= 3 ? getX2(x2.level) : 1
    )
    

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()

    updateMilestoneUpgradeInfo()
    updateAvailability()
}

var getPrimaryEquation = () => {
    let result
    if (page == 1) {
        theory.primaryEquationHeight = 55
        result = `\\dot{\\rho}=k${unlock.level >= 1 ? "E^{-1}" : ""}c_1^{B(c_2)${unlock.level >= 2 ? "x_1" : ""}}${unlock.level >= 3 ? "x_2" : ""}\\\\` + theory.latexSymbol + "=\\max\\rho"
    } else if (page == 2) {
        theory.primaryEquationHeight = 40
        result = `E=\\Pi_{i}{(e-E_i)}`
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}";
}
var getSecondaryEquation = () => {
    let result
    if (page == 1) {
        theory.secondaryEquationHeight = unlock.level >= 1 ? 70 : 37
        result = `B(x)=\\frac{x}{\\sqrt{\\log_{e20}{\\max{(\\rho, e20)}}}}${unlock.level >= 1 ? "\\\\E=e-(1+\\frac{1}{n})^n" : ""}`
    } else if (page == 2) {
        return ""
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getTertiaryEquation = () => {
    let result = `c_1^{B(c_2)${unlock.level >= 2 ? "x_1" : ""}}=${tertiary_display[0].toString(3)},\\quad\\sqrt{\\log_{e20}{\\rho}}=${tertiary_display[1].toString(3)}${unlock.level >= 1 ? `,\\quad E=${getEDisplay(E)}` : ""}`
    return result
}

var getPublicationMultiplier = (tau) => tau.pow(0.15);
var getPublicationMultiplierFormula = (symbol) => "{" + symbol + "}^{0.15}";
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getK = level => Utils.getStepwisePowerSum(level, 2, 5, 0)
var getN = level => Utils.getStepwisePowerSum(level, 2, 4, 0)
var getC1 = level => BigNumber.ONE + 0.5 * level
var getC2Balance = c2 => {
    tertiary_display[1] = BigNumber.from(Math.log(1 + currency.value) / Math.log(1e20)).sqrt()
    return c2 / BigNumber.from(Math.log(Math.max(currency.value, 1e20)) / Math.log(1e20)).sqrt()
}
var getC2 = level => BigNumber.ONE + 0.25 * Math.min(level, 30) + (level > 30 ? (0.25 * (1 - 0.975 ** (level - 30)) / (1 - 0.975)) : 0)
var getX1 = level => BigNumber.ONE + 0.01 * level
var getX2Exponent = level => BigNumber.from(1 + 0.1 * level)
var getX2 = level => BigNumber.E.pow(getX2Exponent(level))

var getEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${base.toString(2)}e${exponent.toString(0)}`
}

var canGoToPreviousStage = () => page == 2
var goToPreviousStage = () => stage = 1
var canGoToNextStage = () => page == 1
var goToNextStage = () => stage = 2

init();
