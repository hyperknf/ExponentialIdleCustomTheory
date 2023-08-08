import { ExponentialCost, FreeCost, LinearCost } from "./api/Costs";
import { BigNumber } from "./api/BigNumber";
import { theory, QuaternaryEntry } from "./api/Theory";
import { Utils } from "./api/Utils";

const TextResource = {
    
}

var id = "ExponentialPowerTest";
var getName = language => {
    const names = {
        "en": "Exponential Power (Test)",
        "zh-Hant": "指數力量 (測試)",
        "zh": "指数力量 (测试)",
        "fi": "Eksponentiaalinen Teho (Testi)"
    }
    return names[language] ?? names.en
}
var getDescription = language => {
    const descriptions = {
        "en": [
            "Exponential Power by HyperKNF",
            "",
            "Chinese Traditional, Chinese Simplified and Finnish are translated by HyperKNF"
        ],
        "zh-Hant": [
            "指數力量由HyperKNF設計",
            "",
            "繁體中文由HyperKNF翻譯"
        ],
        "zh": [
            "指数力量由HyperKNF设计",
            "",
            "简体中文由HyperKNF翻译"
        ],
        "fi": [
            "HyperKNF:stä Eksponentiaalinen Teho",
            "",
            "Suomeksi kääntänyt HyperKNF"
        ]
    }
    return (descriptions[language] ?? descriptions.en).join("\n")
}
var authors = "HyperKNF";
var version = 2;

var currency;
var k, c1, c2, n, a, b, x1, x2;
var unlock
var unlockE

var achievement1, achievement2;
var chapter1, chapter2;

var page = 1
var E = BigNumber.E
var E1 = BigNumber.E, E2 = BigNumber.E, E3 = BigNumber.E, E4 = BigNumber.E
var EDisplay = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO]

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
    currency.value += 1e50

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(0);
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))));
        k.getDescription = (_) => Utils.getMath(getDesc(k.level));
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount));
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(1);
        c1 = theory.createUpgrade(1, currency, new CustomCost(
            level => 15 * getStepwisePowerProduct(level, 2, 50, 0)
        ));
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level));
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount));
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(5);
        let getInfo = (level) => "c_2=" + getC2(level).toString(5);
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(50, Math.log2(10)));
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level));
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount));
    }

    // x1
    {
        let getDesc = level => "x_1=" + getX1(level).toString(3)
        x1 = theory.createUpgrade(3, currency, new ExponentialCost(1e20, Math.log2(50)))
        x1.getDescription = _ => Utils.getMath(getDesc(x1.level))
        x1.getInfo = amount => Utils.getMathTo(getDesc(x1.level), getDesc(x1.level + amount))
    }
    
    // x2
    {
        let getInfo = level => "x_2=" + getX2(level).toString(3)
        let getDesc = level => "x_2=e^{" + getX2Exponent(level) + "}"
        x2 = theory.createUpgrade(4, currency, new ExponentialCost(1e40, Math.log2(10 ** 2.5)))
        x2.getDescription = _ => Utils.getMath(getDesc(x2.level))
        x2.getInfo = amount => Utils.getMathTo(getInfo(x2.level), getInfo(x2.level + amount))
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0);
        n = theory.createUpgrade(5, currency, new ExponentialCost(1e20, Math.log2(1.5)));
        n.getDescription = (_) => Utils.getMath(getDesc(n.level));
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount));
    }

    // a
    {
        let getInfo = (level) => "a=" + getEDisplay(getA(level));
        let getDesc = level => "a=2^{" + (BigNumber.from(-0.05) * level).toString(2) + "}"
        a = theory.createUpgrade(6, currency, new ExponentialCost(1e30, Math.log2(2)));
        a.getDescription = (_) => Utils.getMath(getDesc(a.level));
        a.getInfo = (amount) => Utils.getMathTo(getInfo(a.level), getInfo(a.level + amount));
    }

    // b
    {
        let getDesc = (level) => "b=" + getB(level).toString(0);
        b = theory.createUpgrade(7, currency, new ExponentialCost(1e30, Math.log2(2.5)));
        b.getDescription = (_) => Utils.getMath(getDesc(b.level));
        b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount));
    }

    /////////////////////
    // Permanent Upgrades
    theory.createPublicationUpgrade(0, currency, 1e10);
    theory.createBuyAllUpgrade(1, currency, 1e13);
    theory.createAutoBuyerUpgrade(2, currency, 1e30);

    {
        let getDesc = level => `\\text{Unlock }e_{${level + 1}}`
        let getInfo = level => `\\text{Unlocks }e_{${level + 1}}`
        unlockE = theory.createPermanentUpgrade(3, currency, new CustomCost(
            level => {
                switch (level) {
                    case 0:
                        return BigNumber.ZERO
                    case 1:
                        return BigNumber.from(5e30)
                    case 2:
                        return BigNumber.from(5e40)
                    case 3:
                        return BigNumber.from(5e50)
                }
            }
        ))
        unlockE.getDescription = _ => Utils.getMath(getDesc(unlockE.level))
        unlockE.getInfo = _ => Utils.getMath(getInfo(unlockE.level))
        unlockE.maxLevel = 3
    }

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
    n.isAvailable = unlock.level >= 1 && unlockE.level >= 1
    a.isAvailable = b.isAvailable = unlock.level >= 1 && unlockE.level >= 2
    x1.isAvailable = unlock.level >= 2
    x2.isAvailable = unlock.level >= 3

    unlockE.isAvailable = unlock.level >= 1
}

var tick = (elapsedTime, multiplier) => {
    let dt = BigNumber.from(elapsedTime * multiplier);
    let bonus = theory.publicationMultiplier;

    E1 = EDisplay[0] = BigNumber.E - (BigNumber.ONE + BigNumber.ONE / getN(n.level)).pow(getN(n.level))
    E2 = EDisplay[1] = BigNumber.E - (BigNumber.ONE + getA(a.level) / getB(b.level)).pow(getB(b.level) / getA(a.level))
    E = E1
    if (unlockE.level >= 2) E *= E2
    
    currency.value += dt * bonus * BigNumber.from(getK(k.level)) * (
        unlock.level >= 1 && unlockE.level >= 1 ? E.pow(-0.9) : 1
    ) * (tertiary_display[0] = BigNumber.from(getC1(c1.level)).pow(getC2Balance(getC2(c2.level)) * (
        unlock.level >= 2 ? getX1(x1.level) : 1
    ))) * (
        unlock.level >= 3 ? getX2(x2.level) : 1
    )
    

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
    theory.invalidateQuaternaryValues()

    updateMilestoneUpgradeInfo()
    updateAvailability()
}

var formatQuaternaryEntry = (...args) => new QuaternaryEntry(...args)

var getPrimaryEquation = () => {
    let result
    if (page == 1) {
        theory.primaryEquationHeight = 55
        result = `\\dot{\\rho}=k${unlock.level >= 1 ? "E^{-0.9}" : ""}c_1^{B(c_2)${unlock.level >= 2 ? "x_1" : ""}}${unlock.level >= 3 ? "x_2" : ""}\\\\` + theory.latexSymbol + "=\\max\\rho"
    } else if (page == 2) {
        theory.primaryEquationHeight = 40
        result = `E=\\prod_{i}{e_i}`
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}";
}
var getSecondaryEquation = () => {
    let result
    if (page == 1) {
        theory.secondaryEquationHeight = 37
        result = `B(x)=\\frac{x}{\\sqrt{\\log_{e20}{\\max{(1+\\rho, e20)}}}}`
    } else if (page == 2) {
        theory.secondaryEquationHeight = 37 * unlockE.level
        result = "e_1=e-(1+\\frac{1}{n})^n"
        if (unlockE.level >= 2) result += "\\\\e_2=e-(1+\\frac{a}{b})^{\\frac{b}{a}}"
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getTertiaryEquation = () => {
    let result
    if (page == 1) {
        result = `c_1^{B(c_2)${unlock.level >= 2 ? "x_1" : ""}}=${tertiary_display[0].toString(3)},\\quad\\sqrt{\\log_{e20}{(1+\\rho)}}=${tertiary_display[1].toString(3)}`
    } else result = ""
    return result
}
var getQuaternaryEntries = () => {
    const result = []
    result.push(formatQuaternaryEntry(
        "E",
        unlock.level >= 1 ? getEDisplay(E) : null
    ))
    if (page == 2) {
        result.push(formatQuaternaryEntry(
            "e_1",
            getEDisplay(EDisplay[0])
        ))
        result.push(formatQuaternaryEntry(
            "e_2",
            unlockE.level >= 2 ? getEDisplay(EDisplay[1]) : null
        ))
    }
    return result
}

var getPublicationMultiplier = tau => tau.pow(0.125) / (1 + tau).log10())
var getPublicationMultiplierFormula = symbol => `\\frac{{${symbol}}^{0.125}}{\\log_10(1+${symbol})}`;
var getTau = () => currency.value;
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber();

var getK = level => BigNumber.ZERO + Utils.getStepwisePowerSum(level, 2, 5, 0)
var getC1 = level => BigNumber.ONE + 0.5 * level
var getC2Balance = c2 => {
    tertiary_display[1] = ((1 + currency.value).log() / BigNumber.TEN.pow(20).log()).sqrt()
    return c2 / BigNumber.from(Math.log(Math.max(currency.value, 1e20)) / Math.log(1e20)).sqrt()
}
var getC2 = level => BigNumber.ONE + 0.25 * Math.min(level, 30) + (level > 30 ? (0.25 * (1 - 0.99 ** (level - 30)) / (1 - 0.99)) : 0)
var getN = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getA = level => BigNumber.TWO.pow(-0.05).pow(level)
var getB = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getX1 = level => BigNumber.ONE + 0.015 * level
var getX2Exponent = level => BigNumber.from(1 + 0.1 * level)
var getX2 = level => BigNumber.E.pow(getX2Exponent(level))

var getEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${base.toString(2)}e${exponent.toString(0)}`
}

var canGoToPreviousStage = () => page == 2
var goToPreviousStage = () => page = 1
var canGoToNextStage = () => page == 1 && unlock.level >= 1
var goToNextStage = () => page = 2

init();
