import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { ExponentialCost, FirstFreeCost } from "./api/Costs"
import { Utils } from "./api/Utils"

var id = "MonteCarloSimulation"
var name = "Monte Carlo Simulation"
var description = "Work in progress"
var authors = "HyperKNF"
var version = "0"

var data = {
    currency: undefined,
    symbol: {
        ascii: "σ",
        latex: "\\sigma"
    },
    tau_rate: 1,
    upgrades: {
        c1, c2
    },
    perm_upgrades: {
        pub, all, auto
    }
}

var mcs = {
    t: BigNumber.ZERO
}

var utils = {
    toInternalState: __tis,
    fromInternalState: __fis
}
function __tis(obj) {
    const re = {}
    for (const key of obj) {
        if (obj[key] instanceof BigNumber) re[key] = obj[key].toBase64String()
        else if (typeof obj[key] == "object") re[key] = __tis(obj[key])
        else re[key] = obj[key]
    }
    return re
}
function __fis(obj) {
    const re = {}
    for (const key of obj) {
        try {
            re[key] = BigNumber.fromBase64String(obj[key])
        } catch (e) {
            if (typeof obj[key] == "object") re[key] = __fis(obj[key])
            else re[key] = obj[key]
        }
    }
    return re
}

var init = () => {

    data.currency = theory.createCurrency(symbol.ascii, symbol.latex)

    // upgrades

    const getDesc = level => `c_1=${Variables.c1(level).toString(0)}`
    const c1 = data.upgrades.c1 = theory.createUpgrade(100, data.currency, new FirstFreeCost(new ExponentialCost(2.5, Math.log2(2))))
    c1.getDescription = _ => Utils.getMath(getDesc(c1.level))
    c1.getInfo = amount => Utils.getMathTo(getDesc(c1.level), getDesc(c1.level + amount))

    // perm upgrades

    const pub = data.perm_upgrades.pub = theory.createPublicationUpgrade(0, data.currency, 1e10)
    const all = data.perm_upgrades.all = theory.createBuyAllUpgrade(1, data.currency, 1e13)
    const auto = data.perm_upgrades.auto = theory.createAutoBuyerUpgrade(2, data.currency, 1e18)

}

var tick = (elapsedTime, multiplier) => {

    const dt = elapsedTime * multiplier
    mcs.t += dt * Variables.dt()
    data.currency.value += dt * Variables.c1(data.upgrades.c1.level) * Variables.c2() * (1 - BigNumber.E.pow(-mcs.t))

}

var getPrimaryEquation = () => Equations.primary

var getPublicationMultiplier = tau => (tau + 1).pow(0)
var getPublicationMultiplierFormula = symbol => `(${symbol}+1)^0`
var getCurrencyFromTau = tau => [tau.max(BigNumber.ONE).pow(BigNumber.ONE / data.tau_rate), this.currency.symbol]
var getTau = () => data.currency.value.pow(1 / data.tau_rate)

var getInternalState = () => JSON.stringify(utils.toInternalState(mcs))
var setInternalState = string => {
    for (const [key, value] of Objects.entries(utils.fromInternalState(JSON.parse(string)))) mcs[key] = value
}

var get2DGraphValue = () => data.currency.value.sign * (1 + data.currency.value.abs()).log10().toNumber()

init()

class Equations {

    static get primary() {
        return `\\dot${data.symbol.latex}=c_1c_2(1-e^{-t})`
    }

}

class Variables {

    static c1(level) {
        return Utils.getStepwisePowerSum(level, 2, 5, 0)
    }

    static c2() {
        return 1
    }

    static dt() {
        return 0.1
    }

}