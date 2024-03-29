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
        c1: undefined,
        c2: undefined
    },
    perm_upgrades: {
        pub: undefined,
        all: undefined,
        auto: undefined
    }
}

var mcs = {
    t: BigNumber.ZERO
}

var init = () => {

    data.currency = theory.createCurrency(data.symbol.ascii, data.symbol.latex)

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

var getInternalState = () => JSON.stringify({
    t: mcs.t.toBase64String()
})
var setInternalState = string => {
    const state = JSON.parse(string)
    const to = key => BigNumber.fromBase64String(state[key] ?? BigNumber.ZERO.toBase64String())

    mcs.t = to("t")
}

var get2DGraphValue = () => data.currency.value.sign * (1 + data.currency.value.abs()).log10().toNumber()

init()

class Equations {

    static get primary() {
        return `\\dot${data.symbol.latex} = c_1c_2(1-e^{-t})`
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