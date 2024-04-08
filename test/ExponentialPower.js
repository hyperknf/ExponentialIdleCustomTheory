// @ts-nocheck
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ConstantCost, ExponentialCost, FreeCost, CustomCost, FirstFreeCost } from "./api/Costs";
import { BigNumber } from "./api/BigNumber";
import { theory, QuaternaryEntry } from "./api/Theory";
import { Utils } from "./api/Utils";
import { Localization } from "./api/Localization";
import { ui } from "./api/ui/UI";
import { Thickness } from "./api/ui/properties/Thickness";
import { Color } from "./api/ui/properties/Color";
import { LayoutOptions } from "./api/ui/properties/LayoutOptions";
import { TouchType } from "./api/ui/properties/TouchType";
/*
    TEXT RESOURCE
*/
var TextResource = {
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
            },
            "e200": {
                "Name": {
                    "en": "Idler"
                },
                "Description": {
                    "en": "Reach e200ρ",
                    "zh-Hant": "達到e200ρ",
                    "zh-Hans": "达到e200ρ"
                }
            },
            "e500": {
                "Name": {
                    "en": "Professional"
                },
                "Description": {
                    "en": "Reach e500ρ",
                    "zh-Hant": "達到e500ρ",
                    "zh-Hans": "达到e500ρ"
                }
            },
            "e1000": {
                "Name": {
                    "en": "Exemplary"
                },
                "Description": {
                    "en": "Reach e1000ρ",
                    "zh-Hant": "達到e1000ρ",
                    "zh-Hans": "达到e1000ρ"
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
                    "en": "Serious Hesitation",
                    "zh-Hant": "嚴重猶豫",
                    "zh-Hans": "严重犹豫",
                    "fi": "Vakava Epäröinti"
                },
                "Description": {
                    "en": "Reallocate Add Term milestone upgrade 10 times",
                    "zh-Hant": "重新分配第一個里程碑升級十次",
                    "zh-Hans": "重新分配第一个里程碑升级十次"
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
                "fi": "Tulossa pian"
            }
        },
        "Locked": {
            "en": "?????"
        }
    },
    "ResetStage": {
        "en": "You're about to reset your progress since the last publication. This will perform a publication if a publication is available.",
        "zh-Hant": "你將要重設你在此出版的進度，如果你能夠出版，此將會出版。",
        "zh-Hans": "你将要重设你在此出版的进度，如果你能够出版，此将会出版。",
        "fi": "Olet nollaamassa edistymistäsi edellisen julkaisun jälkeen. Tämä suorittaa julkaisun, jos julkaisu on saatavilla."
    },
    "Time": {
        "en": "Time",
        "zh-Hant": "時間",
        "zh-Hans": "时间",
        "fi": "Aika"
    },
    "TimeSincePublication": {
        "en": "Time since last publication",
        "zh-Hant": "自上次出版以來的時間",
        "zh-Hans": "自上次出版以外的时间",
        "fi": "Aika edellisestä julkaisusta"
    },
    "TimeSinceStarted": {
        "en": "Time since started",
        "zh-Hant": "自開始以來的時間",
        "zh-Hans": "自开始以来的时间",
        "fi": "Aika alkamisesta"
    },
    "RecoveryTime": {
        "en": "Last recovery time",
        "zh-Hant": "上次恢復所需的時間",
        "zh-Hans": "上次恢復所需的时间",
        "fi": "Viimeiseen palautukseen käytetty aika"
    },
    "Enable": {
        "en": "Enable",
        "zh-Hant": "啟動",
        "zh-Hans": "启动",
        "fi": "Käynnistä"
    },
    "Disable": {
        "en": "Disable",
        "zh-Hant": "關閉",
        "zh-Hans": "关闭",
        "fi": "Sammuta"
    },
    "Settings": {
        "Name": {
            "en": "Settings",
            "zh-Hant": "設置",
            "zh-Hans": "设置",
            "fi": "Asetukset"
        },
        "MaxDrhoDisplay": {
            "en": Utils.getMath("\\max\\dot{\\rho}\\text{ display}"),
            "zh-Hant": Utils.getMath("\\max\\dot{\\rho}\\text{\u986F\u793A}"),
            "zh-Hans": Utils.getMath("\\max\\dot{\\rho}\\text{\u663E\u793A}"),
            "fi": Utils.getMath("\\max\\dot{\\rho}\\text{ n\u00E4ytt\u00F6}")
        },
        "TimeDisplay": {
            "en": "Time display",
            "zh-Hant": "時間顯示",
            "zh-Hans": "时间显示",
            "fi": "Aikanäyttö"
        },
        "LockSettings": {
            "en": "Lock settings",
            "zh-Hant": "鎖定設置",
            "zh-Hans": "锁定设置",
            "fi": "Lukitse asetukset"
        }
    },
    "UnlockELatex": {
        "en": "e_i\\text{ max level}"
    },
    "Statistics": {
        "Title": {
            "en": "Statistics",
            "zh-Hant": "數據",
            "zh-Hans": "数据",
            "fi": "Tilastot"
        },
        "Show": {
            "en": "Show statistics",
            "zh-Hant": "顯示數據",
            "zh-Hans": "显示数据",
            "fi": "Näyttää tilastoja"
        }
    },
    "Lifetime": {
        "en": "Lifetime",
        "zh-Hant": "一直以來",
        "zh-Hans": "一直以来"
    },
    "Publication": {
        "en": "Publication",
        "zh-Hant": "此次出版",
        "zh-Hans": "此次出版"
    },
    "Ticks": {
        "en": "Ticks",
        "zh-Hant": "刻數",
        "zh-Hans": "刻数",
        "fi": "Tikki"
    },
    "Total": {
        "en": "Total",
        "zh-Hant": "總共",
        "zh-Hans": "总共",
        "fi": "Yhteensä"
    }
};
/*
    THEORY INFORMATIONS
*/
var id = "ExponentialPowerTest";
var getName = function (language) {
    var _a;
    var names = {
        "en": "Exponential Power t",
        "zh-Hant": "指數力量t",
        "zh-Hans": "指数力量t",
        "fi": "Eksponentiaalinen Teho t"
    };
    return (_a = names[language]) !== null && _a !== void 0 ? _a : names.en;
};
var getDescription = function (language) {
    var _a;
    var descriptions = {
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
    };
    return ((_a = descriptions[language]) !== null && _a !== void 0 ? _a : descriptions.en).join("\n");
};
var authors = "HyperKNF";
var version = "v1.4.test3";
var version_code = 1;
var currency2text = ["δ", "\\delta"];
/*
    DATA
*/
// DRHO DATA
var drho = BigNumber.ZERO;
// THEORY PLACEHOLDERS
var currency, currency2;
var k, c1, c2, n, a, b, x, y, l1, l2, p, x1, x2, y1, y2, dtime;
var test_upgrade, domain_switch;
var unlock, unlock2, increase_unlockE, time_exp, c1_exp;
var publication, unlockE, unlockCurrency2;
// DT DATA
var ad_bonus = false;
var dt = BigNumber.ONE / 10;
// ACHIEVEMENTS PLACEHOLDERS
var achievements = {
    regular: [
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ],
    secret: [
        false,
        false
    ]
};
var progress_achievements, secret_achievements;
var achievement1, achievement2, achievement3, achievement4, achievement5, achievement6, achievement7;
var secret_achievement1, secret_achievement2;
// PAGE DATA
var page = 1;
// E DATA
var E = BigNumber.E;
var E1 = BigNumber.ZERO, E2 = BigNumber.ZERO, E3 = BigNumber.ZERO, E4 = BigNumber.ZERO, E5 = BigNumber.ZERO, E6 = BigNumber.ZERO;
var EDisplay = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO];
// T DATA
var time = BigNumber.ZERO;
// DOMAIN DATA
var domain = 1;
// RHO DATA
var publication_max_drho = BigNumber.ZERO;
var max_drho = BigNumber.ZERO;
var total_rho = BigNumber.ZERO;
// B DATA
var balance_values = [BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO, BigNumber.ZERO];
// TIME DATA
var total_time = [BigNumber.ZERO, BigNumber.ZERO];
var ticks = BigNumber.ZERO;
var recovering = false;
var recovery_time = BigNumber.ZERO;
// DEVELOPER SETTINGS
var unlock_bought = false, unlock_refund = false, unlock_times = 0, tap_count = 0;
var milestones = [20, 50, 100, 170, 290, 400, 450, 650, 720, 900, 925, 960, 1000];
var secret_achievement_chance = 1e6;
var page2_equation_scale = 0.925;
// SETTINGS DATA
var settings = {
    display_overlay: {
        time: true,
        max_drho: true
    },
    lock_settings: false
};
var settings_upgrades = {
    display_overlay: {
        max_drho: null,
        time: null
    },
    lock_settings: null
};
// DISPLAY DATA
var show_stats;
var tertiary_display = Array.from({
    length: 2
}, function () { return BigNumber.ZERO; });
/*
    UTILITIES
*/
var log = function (base, value) { return BigNumber.from(value).log() / BigNumber.from(base).log(); };
var getTextResource = function (resource) { var _a, _b; return (_b = (_a = resource[Localization.language]) !== null && _a !== void 0 ? _a : resource.en) !== null && _b !== void 0 ? _b : "?????"; };
var getStepwisePowerProduct = function (level, base, step_length, offset) {
    if (offset != 0)
        throw new Error("I don't know how to implement non-zero offset :)");
    var step = Math.floor(level / step_length);
    var levels = level % step_length;
    var exponents = Array.from({
        length: step
    }, function () { return step_length; });
    exponents.push(levels);
    var product = exponents.reduce(function (product, value, index) {
        return product * BigNumber.from(base).pow(index + 1).pow(value);
    }, 1);
    return product;
};
var generateCustomCost = function (getCost) { return new CustomCost(getCost, function cumulative_cost(level, amount) {
    var result = BigNumber.ZERO;
    for (var i = 0; i < amount; i++)
        result += getCost(level + i);
    return result;
}, function max(level, currency) {
    var cumulative = BigNumber.ZERO;
    var current_level = level;
    while (cumulative < currency) {
        cumulative += getCost(current_level);
        current_level++;
    }
    return Math.round(current_level - level - 1);
}); };
var formatNumber = function (number, digits, idklol) {
    if (idklol === void 0) { idklol = false; }
    return (!idklol ? (number < 10 ? "0" : "") : "") + BigNumber.from(number).toString(digits);
};
var formatTime = function (time) {
    var remaining_time = BigNumber.from(time).toNumber();
    var days = Math.floor(remaining_time / (60 * 60 * 24));
    remaining_time = remaining_time % (60 * 60 * 24);
    var hours = Math.floor(remaining_time / (60 * 60));
    remaining_time = remaining_time % (60 * 60);
    var minutes = Math.floor(remaining_time / 60);
    remaining_time = remaining_time % 60;
    var seconds = remaining_time;
    var result = [formatNumber(days, 0, true), formatNumber(hours, 0), formatNumber(minutes, 0), formatNumber(seconds, 1)];
    return result;
};
/*
    INITIALIZE
*/
var initialize = function () {
    // CURRENCY CREATION
    currency = theory.createCurrency();
    currency2 = theory.createCurrency.apply(theory, currency2text);
    // REGULAR UPGRADES
    // k
    {
        var getDesc_1 = function (level) { return "k=" + getK(level).toString(0); };
        k = theory.createUpgrade(0, currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.5))));
        k.getDescription = function (_) { return Utils.getMath(getDesc_1(k.level)); };
        k.getInfo = function (amount) { return Utils.getMathTo(getDesc_1(k.level), getDesc_1(k.level + amount)); };
    }
    // c1
    {
        var getDesc_2 = function (level) { return "c_1=" + getC1(level).toString(1); };
        c1 = theory.createUpgrade(1, currency, generateCustomCost(function (level) { return 15 * getStepwisePowerProduct(level, 2, 50, 0); }));
        c1.getDescription = function (_) { return Utils.getMath(getDesc_2(c1.level)); };
        c1.getInfo = function (amount) { return Utils.getMathTo(getDesc_2(c1.level), getDesc_2(c1.level + amount)); };
    }
    // c2
    {
        var getDesc_3 = function (level) { return "c_2=" + getC2(level).toString(5); };
        var getInfo_1 = function (level) { return "c_2=" + getC2(level).toString(5); };
        c2 = theory.createUpgrade(2, currency, new ExponentialCost(50, Math.log2(10)));
        c2.getDescription = function (_) { return Utils.getMath(getDesc_3(c2.level)); };
        c2.getInfo = function (amount) { return Utils.getMathTo(getInfo_1(c2.level), getInfo_1(c2.level + amount)); };
    }
    // x1
    {
        var getDesc_4 = function (level) { return "x_1=" + getX1(level).toString(3); };
        x1 = theory.createUpgrade(3, currency, new ExponentialCost(1e45, Math.log2(77.5)));
        x1.getDescription = function (_) { return Utils.getMath(getDesc_4(x1.level)); };
        x1.getInfo = function (amount) { return Utils.getMathTo(getDesc_4(x1.level), getDesc_4(x1.level + amount)); };
    }
    // x2
    {
        var getDesc_5 = function (level) { return "x_2=" + getX2(level).toString(3); };
        x2 = theory.createUpgrade(4, currency, new SuperExponentialCost(BigNumber.TEN.pow(450), 60, 1.025));
        x2.getDescription = function (_) { return Utils.getMath(getDesc_5(x2.level)); };
        x2.getInfo = function (amount) { return Utils.getMathTo(getDesc_5(x2.level), getDesc_5(x2.level + amount)); };
    }
    // y1
    {
        var getInfo_2 = function (level) { return "y_1=" + getY1(level).toString(3); };
        var getDesc_6 = function (level) { return "y_1=e^{" + getY1Exponent(level).toString(3) + "}"; };
        y1 = theory.createUpgrade(50, currency, new ExponentialCost(1e100, Math.log2(10)));
        y1.getDescription = function (_) { return Utils.getMath(getDesc_6(y1.level)); };
        y1.getInfo = function (amount) { return Utils.getMathTo(getInfo_2(y1.level), getInfo_2(y1.level + amount)); };
    }
    // y2
    {
        var getInfo_3 = function (level) { return "y_2=" + getY2(level).toString(3); };
        var getDesc_7 = function (level) { return "y_2=\\pi^{" + getY2Exponent(level).toString(1) + "}"; };
        y2 = theory.createUpgrade(51, currency, new ExponentialCost(1e170, Math.log2(20)));
        y2.getDescription = function (_) { return Utils.getMath(getDesc_7(y2.level)); };
        y2.getInfo = function (amount) { return Utils.getMathTo(getInfo_3(y2.level), getInfo_3(y2.level + amount)); };
    }
    // n
    {
        var getDesc_8 = function (level) { return "n=" + getN(level).toString(0); };
        n = theory.createUpgrade(100, currency, new ExponentialCost(1e20, Math.log2(1.75)));
        n.getDescription = function (_) { return Utils.getMath(getDesc_8(n.level)); };
        n.getInfo = function (amount) { return Utils.getMathTo(getDesc_8(n.level), getDesc_8(n.level + amount)); };
    }
    // a
    {
        var getInfo_4 = function (level) { return "a=" + getInverseEDisplay(getInverseA(level)); };
        var getDesc_9 = function (level) { return "a=e^{".concat((BigNumber.from(-0.05) * level).toString(2), "}"); };
        a = theory.createUpgrade(101, currency, new ExponentialCost(1e31, Math.log2(2.37)));
        a.getDescription = function (_) { return Utils.getMath(getDesc_9(a.level)); };
        a.getInfo = function (amount) { return Utils.getMathTo(getInfo_4(a.level), getInfo_4(a.level + amount)); };
    }
    // b
    {
        var getDesc_10 = function (level) { return "b=" + getB(level).toString(0); };
        b = theory.createUpgrade(102, currency, new ExponentialCost(1e31, Math.log2(2.93125)));
        b.getDescription = function (_) { return Utils.getMath(getDesc_10(b.level)); };
        b.getInfo = function (amount) { return Utils.getMathTo(getDesc_10(b.level), getDesc_10(b.level + amount)); };
    }
    // x
    {
        var getDesc_11 = function (level) { return "x=" + getX(level).toString(0); };
        x = theory.createUpgrade(103, currency, new ExponentialCost(5e46, Math.log2(1.93)));
        x.getDescription = function (_) { return Utils.getMath(getDesc_11(x.level)); };
        x.getInfo = function (amount) { return Utils.getMathTo(getDesc_11(x.level), getDesc_11(x.level + amount)); };
    }
    // y
    {
        var getDesc_12 = function (level) { return "y=" + getY(level).toString(2); };
        var getInfo_5 = function (level) { return "y=" + getY(level).toString(2); };
        y = theory.createUpgrade(104, currency, new ExponentialCost(5e83, Math.log2(2.046375)));
        y.getDescription = function (_) { return Utils.getMath(getDesc_12(y.level)); };
        y.getInfo = function (amount) { return Utils.getMathTo(getInfo_5(y.level), getInfo_5(y.level + amount)); };
    }
    // l1
    {
        var getDesc_13 = function (level) { return "l_1=" + getL1(level).toString(0); };
        var getInfo_6 = function (level) { return "l_1=" + getL1(level).toString(0); };
        l1 = theory.createUpgrade(105, currency, new ExponentialCost(BigNumber.TEN.pow(650), Math.log2(6.2)));
        l1.getDescription = function (_) { return Utils.getMath(getDesc_13(l1.level)); };
        l1.getInfo = function (amount) { return Utils.getMathTo(getInfo_6(l1.level), getInfo_6(l1.level + amount)); };
    }
    // l2
    {
        var getDesc_14 = function (level) { return "l_2=1.2^{" + getL2Exponent(level).toString(0) + "}"; };
        var getInfo_7 = function (level) { return "l_2=" + getL2(level).toString(2); };
        l2 = theory.createUpgrade(106, currency, new SuperExponentialCost(BigNumber.TEN.pow(650), 24.5, 1.001));
        l2.getDescription = function (_) { return Utils.getMath(getDesc_14(l2.level)); };
        l2.getInfo = function (amount) { return Utils.getMathTo(getInfo_7(l2.level), getInfo_7(l2.level + amount)); };
    }
    // p
    {
        var getDesc_15 = function (level) { return "p=".concat(getP(level)); };
        p = theory.createUpgrade(107, currency, new SuperExponentialCost(BigNumber.TEN.pow(720), 3, 1.00125));
        p.getDescription = function (_) { return Utils.getMath(getDesc_15(p.level)); };
        p.getInfo = function (amount) { return Utils.getMathTo(getDesc_15(p.level), getDesc_15(p.level + amount)); };
    }
    // dt
    {
        var getDesc_16 = function (level) { return "\\dot{t}=" + getDT(level).toString(1); };
        dtime = theory.createUpgrade(999, currency, new CustomCost(function (level) {
            if (level == 0)
                return BigNumber.ZERO;
            if (level <= 10)
                return BigNumber.TEN.pow(10).pow(level);
            if (level >= 10)
                return BigNumber.TEN.pow(1000) * BigNumber.TEN.pow(10).pow(level - 10);
            else
                return BigNumber.ZERO;
        }));
        dtime.getDescription = function (_) { return Utils.getMath(getDesc_16(dtime.level)); };
        dtime.getInfo = function (amount) { return Utils.getMathTo(getDesc_16(dtime.level), getDesc_16(dtime.level + amount)); };
        dtime.maxLevel = 10;
    }
    // PERMANENT UPGRADES
    // default upgrades
    publication = theory.createPublicationUpgrade(0, currency, 1e13);
    theory.createBuyAllUpgrade(1, currency, 1e16);
    theory.createAutoBuyerUpgrade(2, currency, 1e31);
    // unlock e
    {
        var getDesc_17 = function (level) { return Localization.getUpgradeUnlockDesc("e_{".concat(level + 1, "}")); };
        var getInfo_8 = function (level) { return Localization.getUpgradeUnlockInfo("e_{".concat(level + 1, "}")); };
        unlockE = theory.createPermanentUpgrade(100, currency, new CustomCost(function (level) {
            switch (level) {
                case 0:
                    return BigNumber.ZERO;
                case 1:
                    return BigNumber.TEN.pow(32);
                case 2:
                    return BigNumber.TEN.pow(48);
                case 3:
                    return BigNumber.TEN.pow(85);
                case 4:
                    return BigNumber.TEN.pow(650);
                case 5:
                    return BigNumber.TEN.pow(720);
                default:
                    return BigNumber.TEN.pow(9999);
            }
        }));
        unlockE.getDescription = function (_) { return getDesc_17(unlockE.level); };
        unlockE.getInfo = function (_) { return getInfo_8(unlockE.level); };
        unlockE.maxLevel = 4;
    }
    // unlock second currency
    {
        var getDesc = function (_) { return Localization.getUpgradeUnlockDesc(currency2text[1]); };
        var getInfo = function (_) { return Localization.getUpgradeUnlockInfo(currency2text[1]); };
        unlockCurrency2 = theory.createPermanentUpgrade(1000, currency, new ConstantCost(BigNumber.TEN.pow(9999)));
        unlockCurrency2.description = "?????";
        unlockCurrency2.info = "?????";
        unlockCurrency2.maxLevel = 1;
    }
    // max drho display
    {
        var getDesc_18 = function (level) { return "".concat(getTextResource(settings.display_overlay.max_drho ? TextResource.Disable : TextResource.Enable), " ").concat(getTextResource(TextResource.Settings.MaxDrhoDisplay)); };
        var getInfo_9 = getDesc_18;
        settings_upgrades.display_overlay.max_drho = theory.createPermanentUpgrade(10000, currency2, new FreeCost());
        settings_upgrades.display_overlay.max_drho.getDescription = function (level) { return getDesc_18(level); };
        settings_upgrades.display_overlay.max_drho.getInfo = function (level) { return getInfo_9(level); };
        settings_upgrades.display_overlay.max_drho.isAvailable = true;
        settings_upgrades.display_overlay.max_drho.bought = function (_) {
            settings_upgrades.display_overlay.max_drho.level = 0;
            settings.display_overlay.max_drho = !settings.display_overlay.max_drho;
        };
    }
    // time display
    {
        var getDesc_19 = function (level) { return "".concat(getTextResource(settings.display_overlay.time ? TextResource.Disable : TextResource.Enable), " ").concat(getTextResource(TextResource.Settings.TimeDisplay)); };
        var getInfo_10 = getDesc_19;
        settings_upgrades.display_overlay.time = theory.createPermanentUpgrade(10100, currency2, new FreeCost());
        settings_upgrades.display_overlay.time.getDescription = function (level) { return getDesc_19(level); };
        settings_upgrades.display_overlay.time.getInfo = function (level) { return getInfo_10(level); };
        settings_upgrades.display_overlay.time.isAvailable = true;
        settings_upgrades.display_overlay.time.bought = function (_) {
            settings_upgrades.display_overlay.time.level = 0;
            settings.display_overlay.time = !settings.display_overlay.time;
        };
    }
    // lock settings
    {
        var getDesc_20 = function (level) { return "".concat(getTextResource(settings.lock_settings ? TextResource.Disable : TextResource.Enable), " ").concat(getTextResource(TextResource.Settings.LockSettings)); };
        var getInfo_11 = getDesc_20;
        settings_upgrades.lock_settings = theory.createPermanentUpgrade(11000, currency2, new FreeCost());
        settings_upgrades.lock_settings.getDescription = function (level) { return getDesc_20(level); };
        settings_upgrades.lock_settings.getInfo = function (level) { return getInfo_11(level); };
        settings_upgrades.lock_settings.isAvailable = true;
        settings_upgrades.lock_settings.bought = function (_) {
            settings_upgrades.lock_settings.level = 0;
            settings.lock_settings = !settings.lock_settings;
        };
    }
    // show statistics
    {
        var getDesc_21 = function (level) { return getTextResource(TextResource.Statistics.Show); };
        var getInfo_12 = getDesc_21;
        show_stats = theory.createPermanentUpgrade(20000, currency2, new FreeCost());
        show_stats.getDescription = function (level) { return getDesc_21(level); };
        show_stats.getInfo = function (level) { return getInfo_12(level); };
        show_stats.bought = function (_) {
            show_stats.level = 0;
            Popups.statistics.show();
        };
    }
    // SINGULAR UPGRADES
    // domain switch
    {
        domain_switch = theory.createSingularUpgrade(100, currency, new FreeCost());
        domain_switch.getDescription = function (_) { return unlockCurrency2.level >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Description) : getTextResource(TextResource.DomainSwitch.Locked); };
        domain_switch.getInfo = function (_) { return unlockCurrency2.level >= 1 ? getTextResource(TextResource.DomainSwitch.Unlocked.Info) : getTextResource(TextResource.DomainSwitch.Locked); };
        domain_switch.bought = function (_) {
            domain_switch.level = 0;
            if (unlockCurrency2.level >= 1)
                domain = 2;
        };
    }
    /*
    // test upgrade
    {
        test_upgrade = theory.createSingularUpgrade(1000, currency, new FreeCost())
        test_upgrade.getDescription = test_upgrade.getInfo = _ => Utils.getMath(`\\text{${getTextResource(TextResource.TestUpgrade)}}`)
        test_upgrade.bought = _ => currency.value *= 1000
    }
    */
    // MILESTONE UPGRADES
    // settings
    theory.setMilestoneCost(new CustomCost(function (level) { var _a; return BigNumber.from((_a = milestones[level]) !== null && _a !== void 0 ? _a : 9999); }));
    // unlock
    {
        unlock = theory.createMilestoneUpgrade(0, 4);
        unlock.getDescription = function (_) { return Localization.getUpgradeAddTermDesc(unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
                unlock.level == 2 ? "y_1" :
                    "y_2"); };
        unlock.getInfo = function (_) { return Localization.getUpgradeAddTermInfo(unlock.level == 0 ? "E" :
            unlock.level == 1 ? "x_1" :
                unlock.level == 2 ? "y_1" :
                    "y_2"); };
        unlock.canBeRefunded = function (_) { return (time_exp.level == 0 || unlock.level >= 2) && unlock2.level == 0; };
        unlock.bought = function (_) { return unlock_bought = true; };
        unlock.refunded = function (_) { return unlock_refund = true; };
    }
    // unlock 2
    {
        unlock2 = theory.createMilestoneUpgrade(10, 1);
        unlock2.getDescription = function (_) { return Localization.getUpgradeAddTermDesc("x_2"); };
        unlock2.getInfo = function (_) { return Localization.getUpgradeAddTermInfo("x_2"); };
        unlock2.canBeRefunded = function (_) { return increase_unlockE.level == 0; };
    }
    // unlock e max level
    {
        increase_unlockE = theory.createMilestoneUpgrade(50, 2);
        increase_unlockE.getDescription = function (_) { return Localization.getUpgradeIncCustomDesc(getTextResource(TextResource.UnlockELatex), 1); };
        increase_unlockE.getInfo = function (_) { return Localization.getUpgradeIncCustomInfo(getTextResource(TextResource.UnlockELatex), 1); };
        increase_unlockE.canBeRefunded = function (_) { return c1_exp.level == 0; };
    }
    // time exponent
    {
        time_exp = theory.createMilestoneUpgrade(100, 2);
        time_exp.getDescription = function (_) { return Localization.getUpgradeIncCustomExpDesc("t", 0.25); };
        time_exp.getInfo = function (_) { return Localization.getUpgradeIncCustomExpInfo("t", 0.25); };
        time_exp.canBeRefunded = function (_) { return unlock2.level == 0; };
    }
    // c1 exponent
    {
        c1_exp = theory.createMilestoneUpgrade(200, 4);
        c1_exp.getDescription = function (_) { return Localization.getUpgradeIncCustomExpDesc("c_1", c1_exp.level >= 2 ? 0.02 : 0.03); };
        c1_exp.getInfo = function (_) { return Localization.getUpgradeIncCustomExpInfo("c_1", c1_exp.level >= 2 ? 0.02 : 0.03); };
        c1_exp.canBeRefunded = function (_) { return true; };
    }
    // ACHIEVEMENTS
    progress_achievements = theory.createAchievementCategory(0, getTextResource(TextResource.Achievements.Progress.Name));
    secret_achievements = theory.createAchievementCategory(999, getTextResource(TextResource.Achievements.Secret.Name));
    achievement1 = theory.createAchievement(0, progress_achievements, getTextResource(TextResource.Achievements.Progress.e10.Name), getTextResource(TextResource.Achievements.Progress.e10.Description), function () { return achievements.regular[0]; });
    achievement2 = theory.createAchievement(1, progress_achievements, getTextResource(TextResource.Achievements.Progress.e25.Name), getTextResource(TextResource.Achievements.Progress.e25.Description), function () { return achievements.regular[1]; });
    achievement3 = theory.createAchievement(2, progress_achievements, getTextResource(TextResource.Achievements.Progress.e50.Name), getTextResource(TextResource.Achievements.Progress.e50.Description), function () { return achievements.regular[2]; });
    achievement4 = theory.createAchievement(3, progress_achievements, getTextResource(TextResource.Achievements.Progress.e100.Name), getTextResource(TextResource.Achievements.Progress.e100.Description), function () { return achievements.regular[3]; });
    achievement5 = theory.createAchievement(4, progress_achievements, getTextResource(TextResource.Achievements.Progress.e200.Name), getTextResource(TextResource.Achievements.Progress.e200.Description), function () { return achievements.regular[4]; });
    achievement6 = theory.createAchievement(5, progress_achievements, getTextResource(TextResource.Achievements.Progress.e500.Name), getTextResource(TextResource.Achievements.Progress.e500.Description), function () { return achievements.regular[5]; });
    achievement7 = theory.createAchievement(6, progress_achievements, getTextResource(TextResource.Achievements.Progress.e1000.Name), getTextResource(TextResource.Achievements.Progress.e1000.Description), function () { return achievements.regular[5]; });
    secret_achievement1 = theory.createSecretAchievement(5000, secret_achievements, getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Name), getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Description), getTextResource(TextResource.Achievements.Secret.MilestoneUnlock.Hint), function () { return achievements.secret[0]; });
    secret_achievement2 = theory.createSecretAchievement(99900, secret_achievements, getTextResource(TextResource.Achievements.Secret.Luck.Name), getTextResource(TextResource.Achievements.Secret.Luck.Description), getTextResource(TextResource.Achievements.Secret.Luck.Hint), function () { return achievements.secret[1]; });
    ///////////////////
    //// Story chapters
    //chapter1 = theory.createStoryChapter(0, "My First Chapter", "This is line 1,\nand this is line 2.\n\nNice.", () => c1.level > 0)
    //chapter2 = theory.createStoryChapter(1, "My Second Chapter", "This is line 1 again,\nand this is line 2... again.\n\nNice again.", () => c2.level > 0)
};
/*
    SDK FUNCTIONS
*/
var skip_time = function (seconds) {
    var ticks = Math.min(seconds / 0.1, 200);
    var time_per_tick = seconds / ticks;
    var multi = ad_bonus ? 1.5 : 1;
    var autobuy = theory.isAutoBuyerActive;
    for (var ctick = 1; ctick <= ticks; ctick++) {
        if (autobuy)
            buy_all_upgrades();
        tick(time_per_tick, multi);
    }
};
var buy_all_upgrades = function () {
    var upgrades = [k, c1, c2, n, a, b, x, y, l1, l2, p, x1, x2, y1, y2, dtime];
    for (var _i = 0, upgrades_1 = upgrades; _i < upgrades_1.length; _i++) {
        var upgrade = upgrades_1[_i];
        if (upgrade && upgrade.isAutoBuyable)
            upgrade.buy(-1);
    }
};
/*
    TICK UPDATES
*/
// UPDATE PAGE
var updatePage = function () {
    // debug
    if (unlock.level < 1 && page == 2)
        page = 1;
};
// UPDATE MAX LEVEL
var updateMaxLevel = function () {
    // unlock e_i
    var max_level = 4 + increase_unlockE.level;
    if (unlockE.level > max_level) {
        for (var i = unlockE.level; i > max_level; i--) {
            unlockE.level--;
            currency.value += unlockE.cost.getCost(unlockE.level);
        }
    }
    unlockE.maxLevel = max_level;
};
// UPDATE AVAILABILITY
var updateAvailability = function () {
    // regular upgrades
    n.isAvailable = unlock.level >= 1 && unlockE.level >= 1;
    a.isAvailable = b.isAvailable = unlock.level >= 1 && unlockE.level >= 2;
    x.isAvailable = unlock.level >= 1 && unlockE.level >= 3;
    y.isAvailable = unlock.level >= 1 && unlockE.level >= 4;
    l1.isAvailable = l2.isAvailable = unlockE.level >= 5;
    p.isAvailable = unlockE.level >= 6;
    x1.isAvailable = unlock.level >= 2;
    x2.isAvailable = unlock2.level >= 1;
    y1.isAvailable = unlock.level >= 3;
    y2.isAvailable = unlock.level >= 4;
    unlockE.isAvailable = unlock.level >= 1;
    unlock2.isAvailable = unlock.level >= 4 && time_exp.level >= 2;
    increase_unlockE.isAvailable = unlock2.level >= 1;
    time_exp.isAvailable = unlock.level >= 1;
    c1_exp.isAvailable = increase_unlockE.level == increase_unlockE.maxLevel;
    // permanent upgrades
    settings_upgrades.display_overlay.max_drho.isAvailable = !settings.lock_settings;
    settings_upgrades.display_overlay.time.isAvailable = !settings.lock_settings;
    // singular upgrades
    // domain_switch.isAvailable = unlockCurrency2.level >= 1
};
// MAIN FUNCTION
var tick = function (elapsedTime, multiplier) {
    // time
    total_time[0] = total_time[0] + elapsedTime;
    total_time[1] = total_time[1] + elapsedTime;
    ticks += BigNumber.ONE;
    // dt
    dt = BigNumber.from(elapsedTime * multiplier);
    if (multiplier == 1.5)
        ad_bonus = true;
    var bonus = theory.publicationMultiplier;
    // e_i
    E1 = EDisplay[0] = getE1(getN(n.level));
    if (unlockE.level >= 2)
        E2 = EDisplay[1] = getE2(getA(a.level), getB(b.level));
    if (unlockE.level >= 3)
        E3 = EDisplay[2] = getE3(getX(x.level));
    if (unlockE.level >= 4)
        E4 = EDisplay[3] = getE4(getY(y.level));
    if (unlockE.level >= 5)
        E5 = EDisplay[4] = getE5(getL1(l1.level), getL2(l2.level));
    if (unlockE.level >= 6)
        E6 = EDisplay[5] = getE6(getP(p.level));
    E = E1;
    if (unlockE.level >= 2)
        E *= E2;
    if (unlockE.level >= 3)
        E *= E3;
    if (unlockE.level >= 4)
        E *= E4;
    if (unlockE.level >= 5)
        E *= E5;
    if (unlockE.level >= 6)
        E *= E6;
    // t and currencies
    time += dt * getDT(dtime.level);
    var main_exponent = getC1(c1.level).pow(getC1ExtraExponent(c1_exp.level) * getC2Balance(getC2(c2.level)) * (unlock.level >= 2 ? getX1(x1.level) : 1) * (unlock2.level >= 1 ? getX2(x2.level) : 1));
    tertiary_display[0] = main_exponent.toString(3);
    drho = getK(k.level) * bonus * time.pow(getTExp(time_exp.level)) * (unlock.level >= 1 && unlockE.level >= 1 ? E.pow(0.9) : 1) * main_exponent * (unlock.level >= 3 ? getY1(y1.level) : 1) * (unlock.level >= 4 ? getY2(y2.level) : 1);
    currency.value += drho * dt;
    total_rho += drho * dt;
    total_rho = total_rho.max(getCurrencyFromTau(theory.tau)[0]);
    // max rho update
    if (max_drho <= drho * (dt / 0.1))
        max_drho = drho * (dt / 0.1);
    if (publication_max_drho <= drho * (dt / 0.1))
        publication_max_drho = drho * (dt / 0.1);
    // achievements
    if (currency.value >= BigNumber.TEN.pow(10))
        achievements.regular[0] = true;
    if (currency.value >= BigNumber.TEN.pow(25))
        achievements.regular[1] = true;
    if (currency.value >= BigNumber.TEN.pow(50))
        achievements.regular[2] = true;
    if (currency.value >= BigNumber.TEN.pow(100))
        achievements.regular[3] = true;
    if (currency.value >= BigNumber.TEN.pow(200))
        achievements.regular[4] = true;
    if (currency.value >= BigNumber.TEN.pow(500))
        achievements.regular[5] = true;
    if (currency.value >= BigNumber.TEN.pow(1000))
        achievements.regular[6] = true;
    if (unlock_bought && unlock_refund) {
        unlock_bought = unlock_refund = false;
        unlock_times++;
        if (unlock_times >= 10)
            achievements.secret[0] = true;
    }
    if (Math.round(Math.random() * (secret_achievement_chance - 1) + 1) == 1)
        achievements.secret[1] = true;
    // statistics debug
    var publication_rho = getCurrencyFromTau(theory.tau)[0];
    if (publication_rho <= currency.value && recovering) {
        recovering = false;
        recovery_time = total_time[1];
    }
    // equation invalidation
    theory.invalidatePrimaryEquation();
    theory.invalidateSecondaryEquation();
    theory.invalidateTertiaryEquation();
    theory.invalidateQuaternaryValues();
    // calling update functions
    updatePage();
    updateMaxLevel();
    updateAvailability();
};
/*
    CURRENCY VISIBLE
*/
var isCurrencyVisible = function (index) {
    switch (index) {
        case 0:
            return domain == 1;
        case 1:
            return domain == 2; // This is coming in the next update
        default:
            return false; // Invalid index
    }
};
/*
    EQUATION DISPLAYS
*/
var getPrimaryEquation = function () {
    var result;
    if (page == 0) {
        theory.primaryEquationHeight = 100;
        theory.primaryEquationScale = 1;
        result = "B(x)=\\frac{x}{b_0}\\\\b_0=\\prod_{i=1}^{4}{\\sqrt[i+1]{\\max(1,b_i)}}";
    }
    else if (page == 1) {
        theory.primaryEquationHeight = 55;
        theory.primaryEquationScale = 1;
        result = "\\dot{\\rho}=k".concat(publication.level >= 1 ? "m" : "", "t^{").concat(getTExp(time_exp.level) == 1 ? "" : getTExp(time_exp.level).toString(getTExp(time_exp.level) == 1 ? 0 : getTExp(time_exp.level) == 0.5 ? 1 : 2), "}").concat(unlock.level >= 1 ? "E^{-0.9}" : "", "c_1^{").concat(getC1ExtraExponentDisplay(c1_exp.level), "B(c_2").concat(unlock.level >= 2 ? "X" : "", ")}").concat(unlock.level >= 3 ? "Y" : "", "        \\\\")
            + theory.latexSymbol + "=\\max\\rho";
    }
    else if (page == 2) {
        theory.primaryEquationHeight = page2_equation_scale * 40;
        theory.primaryEquationScale = page2_equation_scale;
        result = "E=\\prod_{i}{e_i}";
    }
    else
        result = "\\text{Invalid Page}";
    return "\\begin{array}{c}" + result + "\\end{array}";
};
var getSecondaryEquation = function () {
    var result;
    if (page == 0) {
        theory.secondaryEquationHeight = 80;
        theory.secondaryEquationScale = 1;
        result = [
            "b_1=\\log_{10^{20}}{\\rho}",
            "b_2=\\log_{10^{100}}{\\rho}",
            "b_3=\\log_{10^{500}}{\\rho}",
            "b_4=\\log_{10^{1000}}{\\rho}"
        ].join("\\\\");
    }
    else if (page == 1) {
        theory.secondaryEquationHeight = publication.level >= 1 ? unlock.level >= 2 ? unlock.level >= 3 ? 60 : 40 : 20 : 0;
        theory.secondaryEquationScale = 1;
        result = publication.level >= 1 ? "\\\\m=\\text{".concat(getTextResource(TextResource.PublicationMultiplier), "}") : "";
        if (unlock.level >= 2)
            result += "\\\\X=x_1".concat(unlock2.level >= 1 ? "x_2" : "");
        if (unlock.level >= 3)
            result += "\\\\Y=y_1".concat(unlock.level >= 4 ? "y_2" : "");
    }
    else if (page == 2) {
        theory.secondaryEquationHeight = page2_equation_scale * (function (level) {
            switch (level) {
                case 0: return 0;
                case 1: return 35;
                case 2: return 35;
                case 3: return 75;
                case 4: return 75;
                case 5: return 115;
                case 6: return 115;
                default: return 115;
            }
        })(unlockE.level);
        theory.secondaryEquationScale = page2_equation_scale;
        result = "e_1=e-(1+\\frac{1}{n})^n";
        if (unlockE.level >= 2)
            result += ",\\quad e_2=e-(1+\\frac{a}{b})^{\\frac{b}{a}}";
        if (unlockE.level >= 3)
            result += "\\\\e_3=|1-\\int^e_1\\frac{\\sqrt[x]{e}}{t}dt|";
        if (unlockE.level >= 4)
            result += ",\\quad e_4=1-\\int^{(1+\\frac{1}{y})^y}_{1}\\frac{1}{t}dt";
        if (unlockE.level >= 5)
            result += "\\\\e_5=e-\\frac{l_0}{\\sqrt[l_0]{l_0!}}";
        if (unlockE.level >= 6)
            result += ",\\quad e_6=1-\\frac{\\sqrt{2\\pi p}(\\frac{p}{e})^p}{p!}";
    }
    else
        result = "\\text{Invalid Page}";
    return "\\begin{array}{c}" + result + "\\end{array}";
};
var getTertiaryEquation = function () {
    var result;
    if (page == 1) {
        result = "c_1^{".concat(getC1ExtraExponentDisplay(c1_exp.level), "B(c_2").concat(unlock.level >= 2 ? "X" : "", ")}=").concat(tertiary_display[0], ",\\quad b_0=").concat(tertiary_display[1]);
    }
    else if (page == 2) {
        var list = [];
        if (unlockE.level >= 5)
            list.push("l_0=l_1l_2");
        result = list.join(",\\quad");
    }
    else
        result = "";
    return "\\begin{array}{c}" + result + "\\end{array}";
};
var formatQuaternaryEntry = function (left, right) { return new QuaternaryEntry(left, right); };
var getQuaternaryEntries = function () {
    var result = [];
    result.push(formatQuaternaryEntry("\\dot\\rho", (drho * (dt / 0.1)).toString(5)));
    if (page == 0) {
        result.push(formatQuaternaryEntry("b_0", tertiary_display[1].toString(2)));
        result.push(formatQuaternaryEntry("b_1", balance_values[0].toString(3)));
        result.push(formatQuaternaryEntry("b_2", balance_values[1].toString(3)));
        result.push(formatQuaternaryEntry("b_3", balance_values[2].toString(3)));
        result.push(formatQuaternaryEntry("b_4", balance_values[3].toString(3)));
    }
    if (page == 1) {
        result.push(formatQuaternaryEntry("t", time.toString(2)));
    }
    if (page == 1 && publication.level >= 1) {
        result.push(formatQuaternaryEntry("m", BigNumber.from(theory.publicationMultiplier).toString(2)));
    }
    if (unlock.level >= 1 && page != 0)
        result.push(formatQuaternaryEntry("E", unlockE.level >= 1 ? getInverseEDisplay(E) : null));
    if (page == 2) {
        result.push(formatQuaternaryEntry("e_1", unlock.level >= 1 ? getInverseEDisplay(EDisplay[0]) : null));
        result.push(formatQuaternaryEntry("e_2", unlockE.level >= 2 ? getInverseEDisplay(EDisplay[1]) : null));
        result.push(formatQuaternaryEntry("e_3", unlockE.level >= 3 ? getInverseEDisplay(EDisplay[2]) : null));
        result.push(formatQuaternaryEntry("e_4", unlockE.level >= 4 ? getInverseEDisplay(EDisplay[3]) : null));
        result.push(formatQuaternaryEntry("e_5", unlockE.level >= 5 ? getInverseEDisplay(EDisplay[4]) : null));
        result.push(formatQuaternaryEntry("e_6", unlockE.level >= 6 ? getInverseEDisplay(EDisplay[5]) : null));
    }
    return result;
};
/*
    TAU
*/
var postPublish = function () {
    publication_max_drho = BigNumber.ZERO;
    time = BigNumber.ZERO;
    total_time[1] = BigNumber.ZERO;
    recovering = true;
    domain = 1;
    page = 1;
};
var getCurrencyFromTau = function (tau) { return [tau.max(BigNumber.ONE), currency.symbol]; };
var getPublicationMultiplier = function (tau) { return 15 * tau.pow(0.126) / (10 + tau).log10().pow(0.9); };
var getPublicationMultiplierFormula = function (symbol) { return "m=\\frac{15{".concat(symbol, "}^{0.126}}{\\log^{0.9}_{10}(10+").concat(symbol, ")}"); };
var getTau = function () { return currency.value.max(BigNumber.ZERO); };
var get2DGraphValue = function () { return currency.value.sign * (BigNumber.ONE + currency.value.abs()).log10().toNumber(); };
/*
    VARIABLES
*/
var getK = function (level) {
    var first_layer = BigNumber.ZERO + Utils.getStepwisePowerSum(Math.min(level, 3750), 2, 5, 0);
    var second_layer_base = Utils.getStepwisePowerSum(3751, 2, 5, 0) - Utils.getStepwisePowerSum(3750, 2, 5, 0);
    var second_layer = second_layer_base * Utils.getStepwisePowerSum(Math.max(level - 3750, 0), 2, 7, 0);
    return first_layer + second_layer;
};
var getC1 = function (level) { return BigNumber.ONE + 0.5 * level; };
var getC1ExtraExponent = function (level) { return BigNumber.ONE + 0.03 * Math.min(2, level) + 0.02 * Math.max(0, level - 2); };
var getC1ExtraExponentDisplay = function (level) {
    var value = getC1ExtraExponent(level);
    if (value == 1)
        return "";
    if ((value * 10) % 1 == 0)
        return value.toString(1);
    if ((value * 100) % 1 == 0)
        return value.toString(2);
    return value.toString(3);
};
var getC2BalanceDenominator = function (value) {
    var rho = value.max(1.01);
    var milestones = [BigNumber.TEN.pow(20), BigNumber.TEN.pow(100), BigNumber.TEN.pow(500), BigNumber.TEN.pow(1000)];
    var result = BigNumber.ONE;
    for (var i = 0; i <= milestones.length - 1; i++) {
        var balance_value = log(milestones[i], rho);
        if (balance_value > 1) {
            result *= balance_value.pow(1 / (2 + i));
        }
        balance_values[i] = balance_value;
    }
    return result;
};
var getC2Balance = function (c2) {
    if (currency.value < BigNumber.TEN.pow(20)) {
        if (currency.value >= BigNumber.ONE)
            getC2BalanceDenominator(currency.value);
        tertiary_display[1] = BigNumber.ONE.toString(3);
        return c2;
    }
    var denominator = getC2BalanceDenominator(currency.value);
    tertiary_display[1] = denominator;
    return c2 / denominator;
};
var getC2 = function (level) { return BigNumber.ONE + 0.25 * Math.min(level, 30) + (level > 30 ? (0.25 * (1 - Math.pow(0.99, (level - 30))) / (1 - 0.99)) : 0); };
var getN = function (level) { return BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0); };
var getInverseA = function (level) { return BigNumber.E.pow(0.05 * level); };
var getA = function (level) { return getInverseA(level).pow(-1); };
var getB = function (level) { return BigNumber.ONE + Utils.getStepwisePowerSum(level, 2, 10, 0); };
var getX = function (level) { return BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0); };
var getY = function (level) { return (BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 10, 0)) / 4; };
var getL1 = function (level) { return BigNumber.TWO + Utils.getStepwisePowerSum(level, 2, 7, 0); };
var getL2Exponent = function (level) { return level / BigNumber.ONE; };
var getL2 = function (level) { return BigNumber.from(1.2).pow(getL2Exponent(level)); };
var getP = function (level) { return Utils.getStepwisePowerSum(level, 2, 25, 0) / 100; };
var getX1 = function (level) { return BigNumber.ONE + 0.01 * Math.min(300, level) + 0.005 * Math.max(0, level - 300); };
var getX2 = function (level) { return BigNumber.ONE + 0.002 * Math.min(60, level) + 0.001 * Math.max(0, level - 60); };
var getY1Exponent = function (level) { return level / BigNumber.SIX; };
var getY1 = function (level) { return BigNumber.E.pow(getY1Exponent(level)); };
var getY2Exponent = function (level) { return level / BigNumber.TEN; };
var getY2 = function (level) { return BigNumber.PI.pow(getY2Exponent(level)); };
var getDT = function (level) { return Utils.getStepwisePowerSum(level, 2, 10, 0) / 10; };
var getTExp = function (level) { return BigNumber.ONE / 4 * (2 + (time_exp.isAvailable ? level : 0)); };
/*
    E_I FUNCTIONS
*/
var getE1 = function (n) {
    if (n <= 100)
        return 1 / (BigNumber.E - (BigNumber.ONE + 1 / n).pow(n));
    // Laurent Series
    return 2 * n / BigNumber.E + 11 * n / (6 * BigNumber.E) - 5 / (72 * BigNumber.E * n) + 17 / (540 * BigNumber.E * BigNumber.from(n).pow(2));
};
var getE2 = function (a, b) { return getE1(b / a); };
var getE3 = function (x) {
    if (x <= 20)
        return 1 / (BigNumber.E.pow(1 / x) - 1);
    // Laurent Series
    return x - 1 / 2 + 1 / (12 * x);
};
var getE4 = function (y) {
    if (y <= 10)
        return 1 / (1 - (BigNumber.ONE + 1 / y).pow(y).log());
    // Laurent Series
    return 2 * y + 4 / 3 - 1 / (9 * y) + 8 / (135 * y.pow(2)) - 31 / (810 * y.pow(3));
};
var getE5 = function (l1, l2) {
    var input = l1 * l2;
    // From Sequential Limits
    var stirling = 2 * BigNumber.PI * input;
    if (input < 1000)
        return BigNumber.ONE / (BigNumber.E - (BigNumber.E / (stirling.pow(BigNumber.PI / stirling))));
    else {
        // From Sequential Limits
        // Xelaroc's approximation
        var constant = BigNumber.PI.log() + stirling.log().log() - stirling.log();
        return ((constant.exp() - constant).exp() - 0.5) / BigNumber.E;
    }
};
var getE6 = function (m) {
    // thanks to someone online I found for this gamma function code
    var g = 7;
    var C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    function gamma(z) {
        z -= 1;
        var x = C[0];
        for (var i = 1; i < g + 2; i++)
            x += C[i] / (z + i);
        var t = z + g + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, (z + 0.5)) * Math.exp(-t) * x;
    }
    if (m <= 0)
        return BigNumber.ONE;
    if (m < 5)
        return BigNumber.ONE / (BigNumber.ONE - ((2 * m * BigNumber.PI).sqrt() * (m / BigNumber.E).pow(m)) / gamma(m + 1));
    // Laurent Series
    else
        return 12 * m + 0.5 + 293 / (720 * m) - 4406147 / (43545600 * m.pow(3)) + 14787105577 / (188116992000 * m.pow(5));
};
var factorial = function (number) {
    if (number <= 1)
        return BigNumber.ZERO;
    return (2 * number * BigNumber.PI).sqrt() * (number / BigNumber.E).pow(number);
};
var derangement = function (number) {
    number = BigNumber.from(number);
    if (number < 2)
        return factorial(number);
    return ((-BigNumber.E).pow(number) * number.pow(-number) * (1 / (2 * BigNumber.PI * number.pow(3)).sqrt()
        -
            25 / (12 * (2 * BigNumber.PI * number.pow(5)))
        +
            1489 / (288 * (2 * BigNumber.PI * number.pow(7)))
        -
            799421 / (51840 * (2 * BigNumber.PI * number.pow(9)))) + 1 / BigNumber.E) * factorial(number);
};
var harmonic = function (number) {
    number = BigNumber.from(number);
    if (number <= 10) {
        var sum = BigNumber.ZERO;
        for (var i = 1; i <= number; i++)
            sum += 1 / i;
        return sum;
    }
    // Puiseux series
    return number.log() + 0.5772156649015328606065120900824024310421 + 1 / (2 * number) - 1 / (12 * number.pow(2)) + 1 / (120 * number.pow(4));
};
var getEDisplay = function (E) {
    var exponent = E.log10().floor();
    var base = BigNumber.from(E / BigNumber.TEN.pow(exponent));
    return "".concat(base.toString(2), "e").concat(exponent.toString(0));
};
var getInverseEDisplay = function (E) {
    var exponent = E.log10().floor();
    var base = BigNumber.from(E / BigNumber.TEN.pow(exponent));
    return "".concat((10 / base).toString(2), "e").concat((-(exponent + 1)).toString(0));
};
/*
    EQUATION OVERLAYS
*/
var getEquationOverlay = function (_) {
    var children = [
        ui.createLatexLabel({
            text: version,
            fontSize: 10,
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM
        }),
        ui.createLatexLabel({
            isVisible: function () { return settings.display_overlay.max_drho; },
            text: function () { return Utils.getMath("\\max\\dot{\\rho}=".concat(max_drho.toString(3), "\\quad(").concat(publication_max_drho.toString(3), ")")); },
            fontSize: 10,
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM,
            horizontalOptions: LayoutOptions.END
        }),
        ui.createLatexLabel({
            isVisible: function () { return settings.display_overlay.time; },
            text: function () {
                var formatted = formatTime(total_time[1]);
                var first = formatted[0];
                formatted.splice(0, 1);
                return Utils.getMath("\\text{".concat(getTextResource(TextResource.Time), "}:\\quad").concat(first)) + ":" + formatted.join(":");
            },
            fontSize: 10,
            margin: new Thickness(4, 4),
            textColor: Color.TEXT_MEDIUM,
            verticalOptions: LayoutOptions.END,
            horizontalOptions: LayoutOptions.END
        })
    ];
    var grid = ui.createGrid({
        inputTransparent: true,
        cascadeInputTransparent: true,
        children: children,
        onTouched: function (event) {
            if (event.type != TouchType.PRESSED)
                return;
            tap_count++;
        }
    });
    return grid;
};
/*
    INTERNAL STATES
*/
var getInternalState = function () { return JSON.stringify({
    // Version informations
    version: version,
    version_code: version_code,
    // User settings
    settings: settings,
    // Game data
    lifetime_total_time: total_time[0].toBase64String(),
    publication_total_time: total_time[1].toBase64String(),
    time: time.toBase64String(),
    max_drho: max_drho.toBase64String(),
    total_rho: total_rho.toBase64String(),
    ticks: ticks.toBase64String(),
    // Publication recovery data
    recovering: recovering,
    recovery_time: recovery_time.toBase64String()
}); };
var setInternalState = function (string) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    if (!string)
        return;
    var state = JSON.parse(string);
    settings = (_a = state.settings) !== null && _a !== void 0 ? _a : settings;
    if (typeof state.total_time == "object")
        total_time = [state.total_time, state.total_time];
    else
        total_time = [
            BigNumber.fromBase64String((_b = state.lifetime_total_time) !== null && _b !== void 0 ? _b : BigNumber.ZERO.toBase64String()),
            BigNumber.fromBase64String((_c = state.publication_total_time) !== null && _c !== void 0 ? _c : BigNumber.ZERO.toBase64String())
        ];
    time = BigNumber.fromBase64String((_d = state.time) !== null && _d !== void 0 ? _d : BigNumber.ZERO.toBase64String());
    max_drho = BigNumber.fromBase64String((_e = state.max_drho) !== null && _e !== void 0 ? _e : BigNumber.ZERO.toBase64String());
    publication_max_drho = BigNumber.fromBase64String((_f = state.publication_max_drho) !== null && _f !== void 0 ? _f : BigNumber.ZERO.toBase64String());
    total_rho = BigNumber.fromBase64String((_g = state.total_rho) !== null && _g !== void 0 ? _g : BigNumber.ZERO.toBase64String());
    ticks = BigNumber.fromBase64String((_h = state.ticks) !== null && _h !== void 0 ? _h : BigNumber.ZERO.toBase64String());
    recovering = (_j = state.recovering) !== null && _j !== void 0 ? _j : false;
    recovery_time = BigNumber.fromBase64String((_k = state.recovery_time) !== null && _k !== void 0 ? _k : BigNumber.ZERO.toBase64String());
};
/*
    PAGES AND STAGES
*/
var canResetStage = function () { return true; };
var getResetStageMessage = function () { return getTextResource(TextResource.ResetStage); };
var resetStage = function () {
    if (theory.canPublish) {
        theory.publish();
        return;
    }
    for (var _i = 0, _a = theory.upgrades; _i < _a.length; _i++) {
        var upgrade = _a[_i];
        upgrade.level = 0;
    }
    currency.value = BigNumber.ZERO;
    currency2.value = BigNumber.ZERO;
    postPublish();
    theory.clearGraph();
};
var canGoToPreviousStage = function () { return page == 2 || page == 1; };
var goToPreviousStage = function () { return page--; };
var canGoToNextStage = function () { return (page == 1 && unlock.level >= 1) || page == 0; };
var goToNextStage = function () { return page++; };
/*
    CLASS DEFINITIONS
*/
var SuperExponentialCost = /** @class */ (function (_super) {
    __extends(SuperExponentialCost, _super);
    function SuperExponentialCost(original, base, increment) {
        var _this = this;
        var a = BigNumber.from(original);
        var c = BigNumber.from(base);
        var d = BigNumber.from(increment);
        var cost = function (level) { return a * c.pow(level) * d.pow(0.5 * level * (level + 1)); };
        var cumulative_cost = function (level, amount) {
            var result = BigNumber.ZERO;
            for (var i = 0; i < amount; i++)
                result += cost(level + i);
            return result;
        };
        var max = function (level, currency) {
            var cumulative = BigNumber.ZERO;
            var current_level = level;
            while (cumulative < currency) {
                cumulative += cost(current_level);
                current_level++;
            }
            return Math.round(current_level - level - 1);
        };
        _this = _super.call(this, cost, cumulative_cost, max) || this;
        _this.__instance = "SuperExponentialCost";
        _this.__functions = { cost: cost, cumulative_cost: cumulative_cost, max: max };
        return _this;
    }
    return SuperExponentialCost;
}(CustomCost));
var Popups = /** @class */ (function () {
    function Popups() {
    }
    Object.defineProperty(Popups, "statistics", {
        get: function () {
            var popup = ui.createPopup({
                isPeekable: false,
                title: getTextResource(TextResource.Statistics.Title),
                content: ui.createGrid({
                    children: [
                        ui.createLatexLabel({
                            text: function () {
                                var formatted_time = [formatTime(total_time[0]), formatTime(total_time[1])];
                                var formatted_recovery_time = formatTime(recovery_time);
                                var sfirst = formatted_time[0][0];
                                formatted_time[0].splice(0, 1);
                                var first = formatted_time[1][0];
                                formatted_time[1].splice(0, 1);
                                var rfirst = formatted_recovery_time[0];
                                formatted_recovery_time.splice(0, 1);
                                return [
                                    Utils.getMath("\\text{".concat(getTextResource(TextResource.Ticks), ":}\\quad ").concat(ticks.toString(0))),
                                    Utils.getMath("\\text{".concat(getTextResource(TextResource.TimeSinceStarted), "}:\\quad").concat(sfirst)) + ":" + formatted_time[0].join(":"),
                                    Utils.getMath("\\text{".concat(getTextResource(TextResource.TimeSincePublication), "}:\\quad").concat(first)) + ":" + formatted_time[1].join(":"),
                                    Utils.getMath("\\text{".concat(getTextResource(TextResource.RecoveryTime), "}:\\quad").concat(rfirst)) + ":" + formatted_recovery_time.join(":"),
                                    getTextResource(TextResource.Lifetime) + Utils.getMath("\\quad\\max\\dot{\\rho}=".concat(max_drho.toString(5))),
                                    getTextResource(TextResource.Publication) + Utils.getMath("\\quad\\max\\dot{\\rho}=".concat(publication_max_drho.toString(5))),
                                    Utils.getMath("\\text{".concat(getTextResource(TextResource.Total), " }\\rho =").concat(total_rho))
                                ].join("\\\\");
                            }
                        })
                    ]
                })
            });
            return popup;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Popups, "settings", {
        get: function () {
            throw new Error("Work in progress");
        },
        enumerable: false,
        configurable: true
    });
    return Popups;
}());
// calling initialize
initialize();
