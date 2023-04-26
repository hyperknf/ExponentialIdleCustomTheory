var id = "ExponentialGrowthExtension"
var name = "Extension of Exponential Growth"
var description = "This theory extends the exponential growth and the exponential constant, e\n\nMany items in this theory is the extension from the exponential constant\n\nExploit the exponential growth and its extension to earn currency\n\nTry and get high amount of currencies!\n\nEnjoy!"
var authors = "HyperKNF"
var version = 39
var currency, currency2
var c1, c2, c3, c4, c5, c6, k1, k2, k3, n, m
var x = BigNumber.from(0)
var dp1 = BigNumber.from(0), dp2 = BigNumber.from(0)
var unlock_x
var addTerm, c1Exp, c2Exp
var achievements = []
var chapters = []
var init = () => {
    currency = theory.createCurrency()
    currency2 = theory.createCurrency()

    ///////////////////
    // Regular Upgrades

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(0)
        c1 = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(2.5))))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
        c1.canBeRefunded = (_) => true
    }

    // c2
    {
        let getDesc = (level) => "c_2=2^{" + level + "}"
        let getInfo = (level) => "c_2=" + getC2(level).toString(0)
        c2 = theory.createUpgrade(1, currency, new ExponentialCost(25, Math.log2(30)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
        c2.canBeRefunded = (_) => true
    }
    
    // c3
    {
        let getDesc = (level) => "c_3=3^{" + level + "}"
        let getInfo = (level) => "c_3=" + getC3(level).toString(0)
        c3 = theory.createUpgrade(2, currency, new ExponentialCost(100, Math.log2(70)))
        c3.getDescription = (_) => Utils.getMath(getDesc(c3.level))
        c3.getInfo = (amount) => Utils.getMathTo(getInfo(c3.level), getInfo(c3.level + amount))
        c3.canBeRefunded = (_) => true
    }
    
    // c4
    {
        let getDesc = (level) => "c_4={" + level + "}"
        let getInfo = (level) => `c_4=${level}`
        c4 = theory.createUpgrade(3, currency, new ExponentialCost(50, Math.log2(50)))
        c4.getDescription = (_) => Utils.getMath(getDesc(c4.level))
        c4.getInfo = (amount) => Utils.getMathTo(getInfo(c4.level), getInfo(c4.level + amount))
        c4.canBeRefunded = (_) => true
    }
    
    // c5
    {
        let getDesc = (level) => "c_5=" + level
        let getInfo = (level) => `c_5=${level}`
        c5 = theory.createUpgrade(4, currency, new ExponentialCost(150, Math.log2(75)))
        c5.getDescription = (_) => Utils.getMath(getDesc(c5.level))
        c5.getInfo = (amount) => Utils.getMathTo(getInfo(c5.level), getInfo(c5.level + amount))
        c5.canBeRefunded = (_) => true
    }

    // c6
    {
        let getDesc = (level) => "c_6=" + level
        let getInfo = (level) => `c_6=${level}`
        c6 = theory.createUpgrade(5, currency, new ExponentialCost(1e6, Math.log2(1e6)))
        c6.getDescription = (_) => Utils.getMath(getDesc(c6.level))
        c6.getInfo = (amount) => Utils.getMathTo(getInfo(c6.level), getInfo(c6.level + amount))
        c6.canBeRefunded = (_) => true
        c6.isAvailable = addTerm ? addTerm.level >= 2 : false
    }
    
    // k1
    {
        let getDesc = (level) => "k_1=" + getK1(level)
        let getInfo = (level) => `k_1=${getK1(level)}`
        k1 = theory.createUpgrade(6, currency, new ExponentialCost(25, Math.log2(2)))
        k1.getDescription = (_) => Utils.getMath(getDesc(k1.level))
        k1.getInfo = (amount) => Utils.getMathTo(getInfo(k1.level), getInfo(k1.level + amount))
        k1.canBeRefunded = (_) => true
    }
    
    // k2
    {
        let getDesc = (level) => "k_2=" + (1 + level)
        let getInfo = (level) => `k_2=${1 + level}`
        k2 = theory.createUpgrade(7, currency, new ExponentialCost(10, Math.log2(1.5)))
        k2.getDescription = (_) => Utils.getMath(getDesc(k2.level))
        k2.getInfo = (amount) => Utils.getMathTo(getInfo(k2.level), getInfo(k2.level + amount))
        k2.canBeRefunded = (_) => true
    }
    
    // k3
    {
        let getDesc = (level) => "k_3=" + level
        let getInfo = (level) => `k_3=${level}`
        k3 = theory.createUpgrade(8, currency, new ExponentialCost(10, Math.log2(1.5)))
        k3.getDescription = (_) => Utils.getMath(getDesc(k3.level))
        k3.getInfo = (amount) => Utils.getMathTo(getInfo(k3.level), getInfo(k3.level + amount))
        k3.canBeRefunded = (_) => true
        k3.isAvailable = k2.level >= 1
    }
    
    // n
    {
        let getDesc = (level) => "n=" + level
        let getInfo = (level) => `n=${level}`
        n = theory.createUpgrade(9, currency, new ExponentialCost(1e3, Math.log2(1.5)))
        n.getDescription = (_) => Utils.getMath(getDesc(n.level))
        n.getInfo = (amount) => Utils.getMathTo(getInfo(n.level), getInfo(n.level + amount))
        n.canBeRefunded = (_) => true
    }
    
    // m
    {
        let getDesc = (level) => "m=" + level
        let getInfo = (level) => `m=${level}`
        m = theory.createUpgrade(10, currency2, new FirstFreeCost(new ExponentialCost(100, Math.log2(2))))
        m.getDescription = (_) => Utils.getMath(getDesc(m.level))
        m.getInfo = (amount) => Utils.getMathTo(getInfo(m.level), getInfo(m.level + amount))
        m.canBeRefunded = (_) => true
    }

    /////////////////////
    // Permanent Upgrades

    theory.createPublicationUpgrade(1, currency, 1e1)
    theory.createBuyAllUpgrade(2, currency, 1e20)
    theory.createAutoBuyerUpgrade(3, currency, 1e40)

    ///////////////////////
    //// Milestone Upgrades

    theory.setMilestoneCost(new LinearCost(1, 1))
    
    {
        addTerm = theory.createMilestoneUpgrade(0, 2)
        addTerm.description = addTerm.level == 0 ? "Adds the term \\frac{1.1+\\sin 10n^{\\circ})e^{i\\pi n}}{k_2^{\\frac{1}{e}}-k_3^{\\frac{1}{\\pi}}} to the equation" : "Adds the term c_6\\sqrt{2} to the equation"
        addTerm.info = addTerm.description
        addTerm.boughtOrRefunded = (_) => {
            theory.invalidatePrimaryEquation()
            theory.invalidateSecondaryEquation()
            theory.invalidateTertiaryEquation()
        }
    }

    {
        c1Exp = theory.createMilestoneUpgrade(1, 3)
        c1Exp.description = Localization.getUpgradeIncCustomExpDesc("c_1", "0.05")
        c1Exp.info = Localization.getUpgradeIncCustomExpInfo("c_1", "0.05")
        c1Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation()
    }

    {
        c2Exp = theory.createMilestoneUpgrade(2, 3)
        c2Exp.description = Localization.getUpgradeIncCustomExpDesc("c_2", "0.05")
        c2Exp.info = Localization.getUpgradeIncCustomExpInfo("c_2", "0.05")
        c2Exp.boughtOrRefunded = (_) => theory.invalidatePrimaryEquation()
    }

    /////////////////
    //// Achievements

    achievements.push(theory.createAchievement(0, "The start of chaos", "The start of something bad...", () => c1.level > 1))
    achievements.push(theory.createAchievement(1, "Exponential constant", "You found out about the exponential constant", () => k1.level > 1))
    achievements.push(theory.createAchievement(2, "First milestone", "You reached your first milestone, 1e15, and you're making steady progress", () => getTau() >= 1e15))

    ///////////////////
    //// Story chapters

    chapters.push(theory.createStoryChapter(0, "e", "You started to find out\nthat as k approaches infinity\n(1 + 1/k)^k approaches e\nMaybe this will be useful in your research?", () => true))
    chapters.push(theory.createStoryChapter(1, "Decreased efficiency", "After a bit of time\nyou realised that your research efficiency on the extensions\nis only around half of intended efficiency\nYou realised you will need more time\nto finish your research", () => c6.level >= 1))
    chapters.push(theory.createStoryChapter(2, "Steady progress", "After some more researching\nyou have reached 1e15\nwhich is your first milestone\nYou are still very far away from the research goal\nbut you are making steady progress\nand with your immense dedication\nyou will finish the research in no time", () => getTau() >= 1e15))
    
    ////////////////////////
    //// Update availability
    
    updateAvailability()
}

var updateAvailability = () => {
    c2Exp.isAvailable = c1Exp.level > 0
    k3.isAvailable = k2.level >= 1
}

var tick = (elapsedTime, multiplier) => {
    updateAvailability()
    let dt = BigNumber.from(elapsedTime * multiplier)
    let bonus = theory.publicationMultiplier
    x = (getC1(c1.level).pow(getC1Exponent(c1Exp.level)) * getC2(c2.level).pow(getC2Exponent(c2Exp.level)) * getC3(c3.level) * BigNumber.from(Math.E).pow(c4.level) * BigNumber.from(Math.PI).pow(c5.level) * (addTerm.level >= 2 ? BigNumber.from(Math.E).pow(BigNumber.from(c6.level * Math.sqrt(2))) : 1))
    dp1 = currency.value >= 0 ? ((addTerm.level >= 1 ? (Math.pow(-1, n.level) * (1.1 + Math.sin(n.level / 18 * Math.PI)) / ((1 + k2.level) ** (1 / Math.E) - k3.level ** (1 / Math.PI))) : 1) * (1 + 1 / (getK1(k1.level) + 1)) ** (getK1(k1.level) + 1) * dt * bonus * x ** (2 / 3)) : 1.5 * (n.cost.getCost(n.level) + k2.cost.getCost(k2.level)) - currency.value
    currency.value += dp1
    let sum = 0
    for (let i = 1; i <= Math.floor(Math.sqrt(n.level)); i++) {
        sum += i * Math.sqrt(getK1(k1.level) + k2.level + 1 + k3.level)
    }
    dp2 = m.level * sum
    currency2.value += dp2
    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
}

var getPrimaryEquation = () => {
    return `\\dot{\\rho_1}=\\begin{cases}${addTerm.level >= 1 ? "(\\frac{(1.1+\\sin 10n^{\\circ})e^{i\\pi n}}{k_2^{\\frac{1}{e}}-k_3^{\\frac{1}{\\pi}}})" : ""}(1+\\frac{1}{k_1+1})^{k_1+1}x^{\\frac{2}{3}}, & \\rho_1>=0\\\\1.5(C(n)+C(k_2))-\\rho_1, & \\rho_1<0\\end{cases}`
}

theory.primaryEquationHeight = 60
theory.secondaryEquationHeight = 125

var getSecondaryEquation = () => `x=c_{1}${c1Exp.level != 0 ? "^{" + (1 + 0.05 * c1Exp.level) + "}" : ""}c_2${c2Exp.level != 0 ? "^{" + (1 + 0.05 * c2Exp.level) + "}" : ""}c_{3}e^{c_4${addTerm.level >= 2 ? "+c_6\\sqrt{2}" : ""}}\\pi^{c_5}\\\\\\dot{\\rho_2}=m\\sum_{i=1}^{\\lfloor \\sqrt{n} \\rfloor}{i\\sqrt{k_1+k_2+k_3}}\\\\` + theory.latexSymbol + "=\\max\\rho_1^{0.5(1-\\frac{1}{n+2})}\\rho_2^{0.25}\\sqrt[5]{\\ln (k_3x+1)}"
var getTertiaryEquation = () => `x\\approx ${x.toString(5)}, \\quad\\sqrt[5]{\\ln (k_3x+1)}\\approx ${BigNumber.from(Math.log(x * k3.level + 1) ** 0.2).toString(5)}${addTerm.level >= 1 ? ", \\quad k_2^{\\frac{1}{e}}-k_3^{\\frac{1}{\\pi}}\\approx ${BigNumber.from((1 + k2.level) ** (1 / Math.E) - k3.level ** (1 / Math.PI)).toString(5)}" : ""}`
var getPublicationMultiplier = (tau) => tau.pow(0.3) / BigNumber.from(2)
var getPublicationMultiplierFormula = (symbol) => "\\frac{{" + symbol + "}^{0.3}}{2}"
var getTau = () => (currency.value.max(BigNumber.ONE) == BigNumber.ONE ? BigNumber.ONE : currency.value.pow(BigNumber.from(0.5 * (1 - 1 / (n.level + 2)))) * (Math.log(x * k3.level + 1) ** 0.2)) * currency2.value.pow(BigNumber.from(0.25))
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()
var getC1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getC2 = (level) => BigNumber.TWO.pow(level)
var getC3 = (level) => BigNumber.THREE.pow(level)
var getK1 = (level) => Utils.getStepwisePowerSum(level, 2, 10, 0)
var getC1Exponent = (level) => BigNumber.from(1 + 0.05 * level)
var getC2Exponent = (level) => BigNumber.from(1 + 0.05 * level)
init()
