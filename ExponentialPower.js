import { ConstantCost, ExponentialCost, FreeCost, LinearCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory, QuaternaryEntry } from "./api/Theory"
import { Utils } from "./api/Utils"
import { Localization } from "./api/Localization"

const TextResource = {
    "Achievements": {
        "Progress": {
            "Name": {
                "en": "Progress",
                "zh-Hant": "進度",
                "zh-Hans": "进度"
            },
            "e10": {
                "Name": {
                    "en": "Beginner",
                    "zh-Hant": "初階",
                    "zh-Hans": "初阶"
                },
                "Description": {
                    "en": "Reach e10ρ",
                    "zh-Hant": "達到e10ρ",
                    "zh-Hans": "达到e10ρ"
                }
            },
            "e25": {
                "Name": {
                    "en": "Novice",
                    "zh-Hant": "新手",
                    "zh-Hans": "新手"
                },
                "Description": {
                    "en": "Reach e25ρ",
                    "zh-Hant": "達到e25ρ",
                    "zh-Hans": "达到e25ρ"
                }
            },
            "e50": {
                "Name": {
                    "en": "Learner",
                    "zh-Hant": "學者",
                    "zh-Hans": "学者"
                },
                "Description": {
                    "en": "Reach e50ρ",
                    "zh-Hant": "達到e50ρ",
                    "zh-Hans": "达到e50ρ"
                }
            },
            "e100": {
                "Name": {
                    "en": "Amateur",
                    "zh-Hant": "業餘",
                    "zh-Hans": "业余"
                },
                "Description": {
                    "en": "Reach e100ρ",
                    "zh-Hant": "達到e100ρ",
                    "zh-Hans": "达到e100ρ"
                }
            }
        },
        "Secret": {
            "Name": {
                "en": "Secret",
                "zh-Hant": "秘密",
                "zh-Hans": "秘密"
            },
            "Luck": {
                "Name": {
                    "en": "Luck",
                    "zh-Hant": "幸運",
                    "zh-Hans": "幸运"
                },
                "Description": {
                    "en": "You have a 1 in 1 million chance of getting this achievement per tick",
                    "zh-Hant": "在每一刻有一百萬分之一的機會獲得此成就",
                    "zh-Hans": "在每一刻有一百万分之一的机会获得此成就"
                },
                "Hint": {
                    "en": "Good luck",
                    "zh-Hant": "祝你好運",
                    "zh-Hans": "祝你好运",
                    "fi": "Onnea"
                }
            },
            "MilestoneUnlock": {
                "Name": {
                    "en": "Serious Hesitation"
                },
                "Description": {
                    "en": "Reallocate Add Term milestone upgrade 10 times"
                },
                "Hint": {
                    "en": "Why would you do this?"
                }
            }
        }
    },
    "PublicationMultiplier": {
        "en": "Publication Multiplier",
        "zh-Hant": "出版物倍率",
        "zh-Hans": "出版物倍率",
        "fi": "Julkaisukerroin"
    },
    "TestUpgrade": {
        "en": "Free e3",
        "zh-Hant": "免費e3",
        "zh-Hans": "免费e3",
        "fi": "Ihmainen e3"
    },
    "Hour": {
        "en": "hour",
        "zh-Hant": "小時",
        "zh-Hans": "小时",
        "fi": "tunti",
        "de": "stunde"
    },
    "Second": {
        "en": "second",
        "zh-Hant": "秒",
        "zh-Hans": "秒",
        "fi": "sekuntia"
    },
    "TickRate": {
        "en": "Tick rate",
        "zh-Hant": "刻速",
        "zh-Hans": "刻速"
    },
    "DomainSwitch": {
        "Unlocked": {
            "Description": {
                "en": "Coming soon",
                "zh-Hant": "敬請期待",
                "zh-Hans": "敬请期待",
                "fi": "Tulossa pian"
            },
            "Info": {
                "en": "Coming soon",
                "zh-Hant": "敬請期待",
                "zh-Hans": "敬请期待",
                "fi": "tulossa pian"
            }
        },
        "Locked": "?????"
    },
    "ResetStage": {
        "en": "You're about to reset your progress since the last publication. This will perform a publication if a publication is available.",
        "zh-Hant": "你將要重設你在此出版的進度，如果你能夠出版，此將會出版。",
        "zh-Hans": "你将要重设你在此出版的进度，如果你能够出版，此将会出版。",
        "fi": "Olet nollaamassa edistymistäsi edellisen julkaisun jälkeen. Tämä suorittaa julkaisun, jos julkaisu on saatavilla."
    }
}

var id = "ExponentialPowerTest"
var getName = language => {
    const names = {
        "en": "Exponential Power (Test)",
        "zh-Hant": "指數力量 (測試)",
        "zh-Hans": "指数力量 (测试)",
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
            "繁體中文，簡體中文和芬蘭語由HyperKNF翻譯"
        ],
        "zh-Hans": [
            "指数力量由HyperKNF设计",
            "",
            "简体中文，简体中文和芬兰语由HyperKNF翻译"
        ],
        "fi": [
            "HyperKNF:stä Eksponentiaalinen Teho",
            "",
            "Perinteinen kiina, yksinkertaistettu kiina ja suomeksi kääntänyt HyperKNF"
        ]
    }
    return (descriptions[language] ?? descriptions.en).join("\n")
}
var authors = "HyperKNF"
var version = "pre.v1.3.b21"

const currency2text = ["δ", "\\delta"]

var drho = BigNumber.ZERO

var currency, currency2
var k, c1, c2, n, a, b, x, y, x1, x2, dtime
var test_upgrade, domain_switch
var unlock, time_exp
var publication, tickrate, unlockE, unlockCurrency2

var dt = BigNumber.ONE / 10

var achievements = {
    regular: [
        false,
        false,
        false,
        false
    ],
    secret: [
        false,
        false
    ]
}

var progress_achievements, secret_achievements
var achievement1, achievement2, achievement3, achievement4
var secret_achievement1, secret_achievement2

var page = 1
var E = BigNumber.E
var E1 = BigNumber.ZERO, E2 = BigNumber.ZERO, E3 = BigNumber.ZERO, E4 = BigNumber.ZERO
var EDisplay = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO]
var time = BigNumber.ZERO

var domain_switched = false
var domain = 1

var publication_max_drho = BigNumber.ZERO
var max_drho = BigNumber.ZERO

var unlock_bought = false, unlock_refund = false, unlock_times = 0
var secret_achievement_chance = 1e6
var page2_equation_scale = 0.925

var tertiary_display = Array.from({
    length: 2
}, () => BigNumber.from(0))

var log = (base, value) => BigNumber.from(value).log() / BigNumber.from(base).log()
var getTextResource = resource => resource[Localization.language] ?? resource.en ?? "???"

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

var initialize = () => {
    currency = theory.createCurrency()
    currency2 = theory.createCurrency(...currency2text)

    ///////////////////
    // Regular Upgrades

    // k
    {
        let getDesc = (level) => "k=" + getK(level).toString(0)
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))))
        k.getDescription = (_) => Utils.getMath(getDesc(k.level))
        k.getInfo = (amount) => Utils.getMathTo(getDesc(k.level), getDesc(k.level + amount))
    }

    // c1
    {
        let getDesc = (level) => "c_1=" + getC1(level).toString(1)
        c1 = theory.createUpgrade(1, currency, new CustomCost(
            level => 15 * getStepwisePowerProduct(level, 2, 50, 0)
        ))
        c1.getDescription = (_) => Utils.getMath(getDesc(c1.level))
        c1.getInfo = (amount) => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))
        c1.maxLevel = 9999
    }

    // c2
    {
        let getDesc = (level) => "c_2=" + getC2(level).toString(5)
        let getInfo = (level) => "c_2=" + getC2(level).toString(5)
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(50, Math.log2(10)))
        c2.getDescription = (_) => Utils.getMath(getDesc(c2.level))
        c2.getInfo = (amount) => Utils.getMathTo(getInfo(c2.level), getInfo(c2.level + amount))
    }

    // x1
    {
        let getDesc = level => "x_1=" + getX1(level).toString(2)
        x1 = theory.createUpgrade(3, currency, new ExponentialCost(1e45, Math.log2(77.5)))
        x1.getDescription = _ => Utils.getMath(getDesc(x1.level))
        x1.getInfo = amount => Utils.getMathTo(getDesc(x1.level), getDesc(x1.level + amount))
    }
    
    // x2
    {
        let getInfo = level => "x_2=" + getX2(level).toString(3)
        let getDesc = level => "x_2=e^{" + getX2Exponent(level).toString(1) + "}"
        x2 = theory.createUpgrade(4, currency, new ExponentialCost(1e100, Math.log2(10 ** 2.5)))
        x2.getDescription = _ => Utils.getMath(getDesc(x2.level))
        x2.getInfo = amount => Utils.getMathTo(getInfo(x2.level), getInfo(x2.level + amount))
    }

    // n
    {
        let getDesc = (level) => "n=" + getN(level).toString(0)
        n = theory.createUpgrade(100, currency, new ExponentialCost(1e20, Math.log2(1.75)))
        n.getDescription = (_) => Utils.getMath(getDesc(n.level))
        n.getInfo = (amount) => Utils.getMathTo(getDesc(n.level), getDesc(n.level + amount))
    }

    // a
    {
        let getInfo = (level) => "a=" + getInverseEDisplay(getInverseA(level))
        let getDesc = level => "a=e^{" + (BigNumber.from(-0.05) * level).toString(2) + "}"
        a = theory.createUpgrade(101, currency, new ExponentialCost(1e31, Math.log2(2.37)))
        a.getDescription = (_) => Utils.getMath(getDesc(a.level))
        a.getInfo = (amount) => Utils.getMathTo(getInfo(a.level), getInfo(a.level + amount))
    }

    // b
    {
        let getDesc = (level) => "b=" + getB(level).toString(0)
        b = theory.createUpgrade(102, currency, new ExponentialCost(1e31, Math.log2(2.93125)))
        b.getDescription = (_) => Utils.getMath(getDesc(b.level))
        b.getInfo = (amount) => Utils.getMathTo(getDesc(b.level), getDesc(b.level + amount))
    }

    // x
    {
        let getDesc = (level) => "x=" + getX(level).toString(0)
        x = theory.createUpgrade(103, currency, new ExponentialCost(5e46, Math.log2(1.93)))
        x.getDescription = (_) => Utils.getMath(getDesc(x.level))
        x.getInfo = (amount) => Utils.getMathTo(getDesc(x.level), getDesc(x.level + amount))
    }

    // y
    {
        let getDesc = (level) => "y=" + getY(level).toString(2)
        let getInfo = (level) => "y=" + getY(level).toString(2) + ""
        y = theory.createUpgrade(104, currency, new ExponentialCost(5e83, Math.log2(2.046375)))
        y.getDescription = (_) => Utils.getMath(getDesc(y.level))
        y.getInfo = (amount) => Utils.getMathTo(getInfo(y.level), getInfo(y.level + amount))
    }

    // dt
    {
        let getDesc = (level) => "\\dot{t}=" + getDT(level).toString(1)
        dtime = theory.createUpgrade(999, currency, new CustomCost(
            level => {
                if (level == 0) return BigNumber.ZERO
                if (level <= 10) return BigNumber.TEN.pow(10).pow(level)
                if (level >= 10) return BigNumber.TEN.pow(1000) * BigNumber.TEN.pow(10).pow(level - 10)
            }
        ))
        dtime.getDescription = (_) => Utils.getMath(getDesc(dtime.level))
        dtime.getInfo = (amount) => Utils.getMathTo(getDesc(dtime.level), getDesc(dtime.level + amount))
        dtime.maxLevel = 10
    }

    /////////////////////
    // Permanent Upgrades
    publication = theory.createPublicationUpgrade(0, currency, 1e13)
    theory.createBuyAllUpgrade(1, currency, 1e16)
    theory.createAutoBuyerUpgrade(2, currency, 1e31)

    {
        let getDesc = level => Localization.getUpgradeUnlockDesc(`e_{${level + 1}}`)
        let getInfo = level => Localization.getUpgradeUnlockInfo(`e_{${level + 1}}`)
        unlockE = theory.createPermanentUpgrade(100, currency, new CustomCost(
            level => {
                switch (level) {
                    case 0:
                        return BigNumber.ZERO
                    case 1:
                        return BigNumber.TEN.pow(32)
                    case 2:
                        return BigNumber.TEN.pow(48)
                    case 3:
                        return BigNumber.TEN.pow(85)
                }
            }
        ))
        unlockE.getDescription = _ => getDesc(unlockE.level)
        unlockE.getInfo = _ => getInfo(unlockE.level)
        unlockE.maxLevel = 4
    }

    {
        let getDesc = _ => Localization.getUpgradeUnlockDesc(currency2text[1])
        let getInfo = _ => Localization.getUpgradeUnlockInfo(currency2text[1])
        unlockCurrency2 = theory.createPermanentUpgrade(1000, currency, new ConstantCost(BigNumber.TEN.pow(1000)))
        unlockCurrency2.description = "?????"
        unlockCurrency2.info = "?????"
        unlockCurrency2.maxLevel = 1
    }

    {
        let getDesc = level => Localization.getUpgradeMultCustomDesc("\\text{" + getTextResource(TextResource.TickRate) + "}", 1.2)
        let getInfo = level => Localization.getUpgradeMultCustomInfo("\\text{" + getTextResource(TextResource.TickRate) + "}", 1.2)
        tickrate = theory.createPermanentUpgrade(1100, currency2, new ExponentialCost(1e20, Math.log2(1e20)))
        tickrate.getDescription = level => getDesc(level)
        tickrate.getInfo = level => getInfo(level)
        tickrate.isAvailable = false
    }

    //////////////////////
    //// Singular Upgrades

    {
        domain_switch = theory.createSingularUpgrade(100, currency, new FreeCost())
        domain_switch.getDescription = _ => unlockCurrency2.level >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Description) : getTextResource(TextResource.DomainSwitch.Locked)
        domain_switch.getInfo = _ => unlockCurrency2 >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Info) : getTextResource(TextResource.DomainSwitch.Locked)
        domain_switch.bought = _ => {
            domain_switch.level = 0
            domain_switched = true
        }
    }

    {
        test_upgrade = theory.createSingularUpgrade(1000, currency, new FreeCost())
        test_upgrade.getDescription = test_upgrade.getInfo = _ => Utils.getMath(`\\text{${getTextResource(TextResource.TestUpgrade)}}`)
        test_upgrade.bought = _ => currency.value *= 1000
    }

    ///////////////////////
    //// Milestone Upgrades
    theory.setMilestoneCost(new CustomCost(level => {
        switch (level) {
            case 0:
                return BigNumber.from(20)
            case 1:
                return BigNumber.from(50)
            case 2:
                return BigNumber.from(100)
            case 3:
                return BigNumber.from(175)
            case 4:
                return BigNumber.from(255)
            default:
                return BigNumber.from(1000)
        }
    }))

    { 
        unlock = theory.createMilestoneUpgrade(0, 3)
        unlock.getDescription = _ => Localization.getUpgradeAddTermDesc(
            unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
            "x_2"
        )
        unlock.getInfo = _ => Localization.getUpgradeAddTermInfo(
            unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
            "x_2"
        )
        unlock.canBeRefunded = _ => time_exp.level == 0 || unlock.level >= 2
        unlock.bought = _ => unlock_bought = true
        unlock.refunded = _ => unlock_refund = true
    }

    { 
        time_exp = theory.createMilestoneUpgrade(100, 2)
        time_exp.getDescription = _ => Localization.getUpgradeIncCustomExpDesc("t", 0.25)
        time_exp.getInfo = _ => Localization.getUpgradeIncCustomExpInfo("t", 0.25)
    }
    
    /////////////////
    //// Achievements
    progress_achievements = theory.createAchievementCategory(
        0,
        getTextResource(TextResource.Achievements.Progress.Name)
    )
    secret_achievements = theory.createAchievementCategory(
        999,
        getTextResource(TextResource.Achievements.Secret.Name)
    )
    
    achievement1 = theory.createAchievement(
        0,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e10.Name),
        getTextResource(TextResource.Achievements.Progress.e10.Description),
        () => achievements.regular[0]
    )
    achievement2 = theory.createAchievement(
        1,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e25.Name),
        getTextResource(TextResource.Achievements.Progress.e25.Description),
        () => achievements.regular[1]
    )
    achievement3 = theory.createAchievement(
        2,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e50.Name),
        getTextResource(TextResource.Achievements.Progress.e50.Description),
        () => achievements.regular[2]
    )
    achievement3 = theory.createAchievement(
        3,
        progress_achievements,
        getTextResource(TextResource.Achievements.Progress.e100.Name),
        getTextResource(TextResource.Achievements.Progress.e100.Description),
        () => achievements.regular[3]
    )

    secret_achievement1 = theory.createSecretAchievement(
        5000,
        secret_achievements,
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Name),
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Description),
        getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Hint),
        () => achievements.secret[0]
    )
    secret_achievement2 = theory.createSecretAchievement(
        99900,
        secret_achievements,
        getTextResource(TextResource.Achievements.Secret.Luck.Name),
        getTextResource(TextResource.Achievements.Secret.Luck.Description),
        getTextResource(TextResource.Achievements.Secret.Luck.Hint),
        () => achievements.secret[1]
    )
    
    ///////////////////
    //// Story chapters
    //chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0)
    //chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0)
}

var updatePage = () => {
    if (unlock.level < 1 && page == 2) page = 1
}

var updateAvailability = () => {
    n.isAvailable = unlock.level >= 1 && unlockE.level >= 1
    a.isAvailable = b.isAvailable = unlock.level >= 1 && unlockE.level >= 2
    x.isAvailable = unlock.level >= 1 && unlockE.level >= 3
    y.isAvailable = unlock.level >= 1 && unlockE.level >= 4
    x1.isAvailable = unlock.level >= 2
    x2.isAvailable = unlock.level >= 3

    unlockE.isAvailable = unlock.level >= 1

    time_exp.isAvailable = unlock.level >= 1
}

var tick = (elapsedTime, multiplier) => {
    dt = BigNumber.from(elapsedTime * multiplier) * getTickRate(tickrate.level)
    const bonus = theory.publicationMultiplier

    E1 = EDisplay[0] = getE1(getN(n.level))
    if (unlockE.level >= 2) E2 = EDisplay[1] = getE2(getA(a.level), getB(b.level))
    if (unlockE.level >= 3) E3 = EDisplay[2] = getE3(getX(x.level))
    if (unlockE.level >= 4) E4 = EDisplay[3] = getE4(getY(y.level))
    E = E1
    if (unlockE.level >= 2) E *= E2
    if (unlockE.level >= 3) E *= E3
    if (unlockE.level >= 4) E *= E4

    time += dt * getDT(dtime.level)
    const main_exponent = getC1(c1.level).pow(getC2Balance(getC2(c2.level)) * (
        unlock.level >= 2 ? getX1(x1.level) : 1
    ))
    tertiary_display[0] = main_exponent.toString(3)
    drho = getK(k.level) * bonus * time.pow(getTExp(time_exp.level)) * (
        unlock.level >= 1 && unlockE.level >= 1 ? E.pow(0.9) : 1
    ) * main_exponent * (
        unlock.level >= 3 ? getX2(x2.level) : 1
    )
    currency.value += drho * dt

    if (max_drho <= drho * (dt / 0.1)) max_drho = drho * (dt / 0.1)
    if (publication_max_drho <= drho * (dt / 0.1)) publication_max_drho = drho * (dt / 0.1)

    if (currency.value >= BigNumber.TEN.pow(10)) achievements.regular[0] = true
    if (currency.value >= BigNumber.TEN.pow(25)) achievements.regular[1] = true
    if (currency.value >= BigNumber.TEN.pow(50)) achievements.regular[2] = true
    if (currency.value >= BigNumber.TEN.pow(100)) achievements.regular[3] = true

    if (unlock_bought && unlock_refund) {
        unlock_bought = unlock_refund = false
        unlock_times++
        if (unlock_times >= 10) achievements.secret[0] = true
    }
    if (Math.round(Math.random() * (secret_achievement_chance - 1) + 1) == 1) achievements.secret[1] = true

    theory.invalidatePrimaryEquation()
    theory.invalidateSecondaryEquation()
    theory.invalidateTertiaryEquation()
    theory.invalidateQuaternaryValues()

    updatePage()
    updateAvailability()
}

var postPublish = () => {
    publication_max_drho = BigNumber.ZERO
    time = BigNumber.ZERO
    domain = 1
    page = 1
}

var formatQuaternaryEntry = (...args) => new QuaternaryEntry(...args)

var isCurrencyVisible = index => {
    switch (index) {
        case 0:
            return domain == 1
        case 1:
            return domain == 2 // This is coming in the next update
        default:
            return false // Invalid index
    }
}

var getPrimaryEquation = () => {
    let result
    if (page == 1) {
        theory.primaryEquationHeight = 55
        theory.primaryEquationScale = 1
        result = `\\dot{\\rho}=k${publication.level >= 1 ? "m" : ""}t^{${getTExp(time_exp.level) == 1 ? "" : getTExp(time_exp.level).toString(getTExp(time_exp.level) == 1 ? 0 : getTExp(time_exp.level) == 0.5 ? 1 : 2)}}${unlock.level >= 1 ? "E^{-0.9}" : ""}c_1^{B(c_2${unlock.level >= 2 ? "x_1" : ""})}${unlock.level >= 3 ? "x_2" : ""}\
        \\\\`
        + theory.latexSymbol + "=\\max\\rho"
    } else if (page == 2) {
        theory.primaryEquationHeight = page2_equation_scale * 40
        theory.primaryEquationScale = page2_equation_scale
        result = `E=\\prod_{i}{e_i}`
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getSecondaryEquation = () => {
    let result
    if (page == 1) {
        theory.secondaryEquationHeight = publication.level >= 1 ? 57 : 37
        theory.secondaryEquationScale = 1
        result = `B(x)=\\frac{x}{\\sqrt{\\log_{10^{20}}{\\max{(\\rho,10^{20})}}}}${publication.level >= 1 ? `\\\\m=\\text{${getTextResource(TextResource.PublicationMultiplier)}}` : ""}`
    } else if (page == 2) {
        theory.secondaryEquationHeight = page2_equation_scale * (
            level => {
                switch (level) {
                    case 0: return 0
                    case 1: return 35
                    case 2: return 70
                    case 3: return 110
                    case 4: return 150
                    default: return 150
                }
            }
        )(unlockE.level)
        theory.secondaryEquationScale = page2_equation_scale
        result = "e_1=e-(1+\\frac{1}{n})^n"
        if (unlockE.level >= 2) result += "\\\\e_2=e-(1+\\frac{a}{b})^{\\frac{b}{a}}"
        if (unlockE.level >= 3) result += "\\\\e_3=|1-\\int^e_1\\frac{\\sqrt[x]{e}}{t}dt|"
        if (unlockE.level >= 4) result += "\\\\e_4=1-\\int^{(1+\\frac{1}{y})^y}_{1}\\frac{1}{t}dt"
    } else result = "\\text{Invalid Page}"
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getTertiaryEquation = () => {
    let result
    if (page == 1) {
        result = `\\text{${getTextResource(TextResource.TickRate)}:}\\quad ${(dt * 100).toString(5)}/\\text{${getTextResource(TextResource.Second)}}\\\\c_1^{B(c_2${unlock.level >= 2 ? "x_1" : ""})}=${tertiary_display[0]},\\quad\\sqrt{\\log_{10^{20}}{\\rho}}=${tertiary_display[1]}`
    } else result = ""
    return "\\begin{array}{c}" + result + "\\end{array}"
}
var getQuaternaryEntries = () => {
    const result = []
    result.push(formatQuaternaryEntry(
        "\\dot\\rho",
        (drho * (dt / 0.1)).toString(5)
    ))
    if (page == 1) {
        result.push(formatQuaternaryEntry(
            "t",
            time.toString(2)
        ))
    }
    if (page == 1 && publication.level >= 1) {
        result.push(formatQuaternaryEntry(
            "m",
            BigNumber.from(theory.publicationMultiplier).toString(2)
        ))
    }
    if (unlock.level >= 1) result.push(formatQuaternaryEntry(
        "E",
        unlockE.level >= 1 ? getInverseEDisplay(E) : null
    ))
    if (page == 2) {
        result.push(formatQuaternaryEntry(
            "e_1",
            unlock.level >= 1 ? getInverseEDisplay(EDisplay[0]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_2",
            unlockE.level >= 2 ? getInverseEDisplay(EDisplay[1]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_3",
            unlockE.level >= 3 ? getInverseEDisplay(EDisplay[2]) : null
        ))
        result.push(formatQuaternaryEntry(
            "e_4",
            unlockE.level >= 4 ? getInverseEDisplay(EDisplay[3]) : null
        ))
    }
    return result
}

var getCurrencyFromTau = tau => [tau.max(BigNumber.ONE), currency.symbol]
var getPublicationMultiplier = tau => 15 * tau.pow(0.126) / (10 + tau).log10().pow(0.9)
var getPublicationMultiplierFormula = symbol => `m=\\frac{15{${symbol}}^{0.126}}{\\log^{0.9}_{10}(10+${symbol})}`
var getTau = () => currency.value.max(BigNumber.ZERO)
var get2DGraphValue = () => currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber()

var getK = level => BigNumber.ZERO + Utils.getStepwisePowerSum(level, 2, 5, 0)
var getC1 = level => BigNumber.ONE + 0.5 * level
var getC2Balance = c2 => {
    const e20 = BigNumber.TEN.pow(20)
    if (currency.value == 0) {
        tertiary_display[1] = "-\\infty"
        return c2
    }
    tertiary_display[1] = log(e20, currency.value.max(1.1)).sqrt().toString(3)
    return c2 / log(e20, currency.value.max(e20)).sqrt()
}
var getC2 = level => BigNumber.ONE + 0.25 * Math.min(level, 30) + (level > 30 ? (0.25 * (1 - 0.99 ** (level - 30)) / (1 - 0.99)) : 0)
var getN = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getInverseA = level => BigNumber.E.pow(0.05 * level)
var getA = level => getInverseA(level).pow(-1)
var getB = level => BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getX = level => BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0)
var getY = level => (BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0)) / 4
var getX1 = level => BigNumber.ONE + 0.01 * level
var getX2Exponent = level => BigNumber.ONE + 0.1 * level
var getX2 = level => BigNumber.E.pow(getX2Exponent(level))
var getDT = level => Utils.getStepwisePowerSum(level, 2, 10, 0) / 10

var getTickRate = level => BigNumber.from(1.2).pow(level)

var getTExp = level => BigNumber.ONE / 4 * (2 + (time_exp.isAvailable ? level : 0))

var getE1 = n => {
    if (n <= 100) return 1 / (BigNumber.E - (BigNumber.ONE + 1 / n).pow(n))
    // Laurent Series
    return 2 * n / BigNumber.E + 11 * n / (6 * BigNumber.E) - 5 / (72 * BigNumber.E * n) + 17 / (540 * BigNumber.E * BigNumber.from(n).pow(2))
}
var getE2 = (a, b) => getE1(b / a)
var getE3 = x => {
    if (x <= 20) return 1 / (BigNumber.E.pow(1 / x) - 1)
    // Laurent Series
    return x - 1 / 2 + 1 / (12 * x)
}
var getE4 = y => {
    if (y <= 10) return 1 / (1 - (BigNumber.ONE + 1 / y).pow(y).log())
    // Laurent Series
    return 2 * y + 4 / 3 - 1 / (9 * y) + 8 / (135 * y.pow(2)) - 31 / (810 * y.pow(3))
}

var factorial = number => {
    if (number <= 1) return 0
    return (2 * number * BigNumber.PI).sqrt() * (number / BigNumber.E).pow(number)
}
var derangement = number => {
    number = BigNumber.from(number)
    if (number < 2) return factorial(number)
    return (
        (-BigNumber.E).pow(number) * number.pow(-number) * (
            1 / (2 * BigNumber.PI * number.pow(3)).sqrt()
            -
            25 / (12 * (2 * BigNumber.PI * number.pow(5)))
            +
            1489 / (288 * (2 * BigNumber.PI * number.pow(7)))
            -
            799421 / (51840 * (2 * BigNumber.PI * number.pow(9)))
        ) + 1 / BigNumber.E
    ) * factorial(number)
}
var harmonic = number => {
    number = BigNumber.from(number)
    if (number <= 10) {
        let sum = 0;
        for (let i = 1; i <= number; i++) sum += 1 / i
        return sum
    }
    // Puiseux series
    return number.log() + 0.5772156649015328606065120900824024310421 + 1 / (2 * number) - 1 / (12 * number.pow(2)) + 1 / (120 * number.pow(4))
}

var getEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${base.toString(3)}e${exponent.toString(0)}`
}
var getInverseEDisplay = E => {
    const exponent = E.log10().floor()
    const base = BigNumber.from(E / BigNumber.TEN.pow(exponent))
    return `${(10 / base).toString(3)}e${(-(exponent + 1)).toString(0)}`
}

var getEquationOverlay = _ => {
    const grid = ui.createGrid({
        inputTransparent: true,
        cascadeInputTransparent: false,
        children: [
            ui.createLatexLabel({
                text: version,
                fontSize: 10, 
                margin: new Thickne
