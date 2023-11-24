import { ConstantCost, CustomCost, ExponentialCost, FirstFreeCost, FreeCost } from "./api/Costs"
import { BigNumber } from "./api/BigNumber"
import { theory } from "./api/Theory"
import { Utils } from "./api/Utils"
import { Localization } from "./api/Localization"

var id = "TimeCurve"
var name = "Curve of Time"
var description = "Curve of Time by HyperKNF"
var authors = "HyperKNF"
var version = "1.3"


class CurveOfTime {
    theory
    currency
        
    dot_rho
    dot_q
    ft
    gt
    t
    q
        
    GraphDisplay
    Settings

    Upgrades
    PermanentUpgrades
    SingularUpgrades
    MilestoneUpgrades

    constructor() {
        this.theory = theory
        this.currency = this.theory.createCurrency()
        
        this.dot_rho = BigNumber.ZERO
        this.dot_q = BigNumber.ZERO
        this.ft = BigNumber.ZERO
        this.gt = BigNumber.ZERO
        this.t = BigNumber.ZERO
        this.q = BigNumber.ONE
        
        this.GraphDisplay = {
            ft: false,
            gt: false
        }
        this.Settings = {
            tau_rate: 0.5,
            publication_divide_power: 4,
            t1_decay_rate: 1.08,
            milestones: [
                12,
                28,
                36
            ],
            milestone_drho_multi: 2,
            q_terms_costs: [
                BigNumber.TEN.pow(15),
                BigNumber.TEN.pow(20)
            ],
            milestone_dq_multi: 2
        }

        this.Upgrades = {
            q1: (()=>{
                const getDesc = level => `q_1=${this.getQ1(level).toString(0)}`
                const q1 = this.theory.createUpgrade(100, this.currency, new FirstFreeCost(new ExponentialCost(10, Math.log2(1.75))))
                q1.getDescription = _ => Utils.getMath(getDesc(q1.level))
                q1.getInfo = amount => Utils.getMathTo(getDesc(q1.level), getDesc(q1.level + amount))
                return q1
            })(),
            q2: (()=>{
                const getDesc = level => `q_2=2^{${level}}`
                const getInfo = level => `q_2=${this.getQ2(level).toString(0)}`
                const q2 = this.theory.createUpgrade(200, this.currency, new ExponentialCost(15, Math.log2(6)))
                q2.getDescription = _ => Utils.getMath(getDesc(q2.level))
                q2.getInfo = amount => Utils.getMathTo(getInfo(q2.level), getInfo(q2.level + amount))
                return q2
            })(),
            r1: (()=>{
                const getDesc = level => `r_1=${this.getR1(level).toString(0)}`
                const r1 = this.theory.createUpgrade(1000, this.currency, new ExponentialCost(BigNumber.TEN.pow(this.Settings.milestones[0]), Math.log2(1.8)))
                r1.getDescription = _ => Utils.getMath(getDesc(r1.level))
                r1.getInfo = amount => Utils.getMathTo(getDesc(r1.level), getDesc(r1.level + amount))
                return r1
            })(),
            r2: (()=>{
                const getDesc = level => `r_2=3^{${this.getR2Exponent(level).toString(1)}}`
                const getInfo = level => `r_2=${this.getR2(level)}`
                const r2 = this.theory.createUpgrade(1100, this.currency, new ExponentialCost(this.Settings.q_terms_costs[0], Math.log2(1.7)))
                r2.getDescription = _ => Utils.getMath(getDesc(r2.level))
                r2.getInfo = amount => Utils.getMathTo(getInfo(r2.level), getInfo(r2.level + amount))
                return r2
            })(),
            c: (()=>{
                const getDesc = level => `c=${this.getC(level).toString(0)}`
                const c = this.theory.createUpgrade(10000, this.currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
                c.getDescription = _ => Utils.getMath(getDesc(c.level))
                c.getInfo = amount => Utils.getMathTo(getDesc(c.level), getDesc(c.level + amount))
                return c
            })(),
            t1: (()=>{
                const getDesc = level => `t_1=\\frac{${this.getCMultiplier(level).toString(0)}}{${this.Settings.t1_decay_rate}^{${level}}}`
                const getInfo = level => `t_1=${this.getT1(level)}`
                const t1 = this.theory.createUpgrade(20000, this.currency, new ExponentialCost(BigNumber.TEN.pow(5), Math.log2(BigNumber.TEN.pow(2.5))))
                t1.getDescription = _ => Utils.getMath(getDesc(t1.level))
                t1.getInfo = amount => `${Utils.getMathTo(getDesc(t1.level), getDesc(t1.level + amount))} (${Utils.getMathTo(getInfo(t1.level), getInfo(t1.level + amount))})`
                return t1
            })()
        }
        this.PermanentUpgrades = {
            publications: this.theory.createPublicationUpgrade(0, this.currency, 1e8),
            buy_all: this.theory.createBuyAllUpgrade(1, this.currency, 1e9),
            auto_buyer: this.theory.createAutoBuyerUpgrade(2, this.currency, 1e15),
            auto_reset: (()=>{
                const auto_reset = this.theory.createPermanentUpgrade(100, this.currency, new ConstantCost(BigNumber.TEN.pow(100)))
                auto_reset.description = Utils.getMath(`\\text{Automatic }t\\text{ resetter}`)
                auto_reset.info = Utils.getMathTo(`\\dot{t}=c-t,\\, t \\ge c\\quad`,`\\quad\\dot{t}=-t,\\, t \\ge c`)
                auto_reset.maxLevel = 1
                return auto_reset
            })(),
            unlock_q_terms: (()=>{
                const unlock_q_terms = this.theory.createPermanentUpgrade(1000, this.currency, new CustomCost(
                    level => {
                        return this.Settings.q_terms_costs[level] ?? BigNumber.ZERO
                    }
                ))
                unlock_q_terms.getDescription = _ => unlock_q_terms.level >= 1 ? Localization.getUpgradeAddTermDesc(`g(t)`) : Localization.getUpgradeAddTermDesc(`r_2`)
                unlock_q_terms.getInfo = _ => unlock_q_terms.level >= 1 ? Localization.getUpgradeAddTermInfo(`g(t)`) : Localization.getUpgradeAddTermInfo(`r_2`)
                unlock_q_terms.maxLevel = 2
                return unlock_q_terms
            })(),
            display_ft: (()=>{
                const display_ft = this.theory.createPermanentUpgrade(10000, this.currency, new FreeCost())
                display_ft.getDescription = _ => !this.GraphDisplay.ft ? Utils.getMath(`\\text{Display }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Display }\\rho\\text{ on graph}`)
                display_ft.getInfo = _ => !this.GraphDisplay.ft ? Utils.getMath(`\\text{Displays }f(t)\\text{ on graph}`) : Utils.getMath(`\\text{Displays }\\rho\\text{ on graph}`)
                display_ft.bought = _ => {
                    display_ft.level = 0
                    this.PermanentUpgrades.display_gt.level = 0
                    this.GraphDisplay.gt = false
                    this.GraphDisplay.ft = !this.GraphDisplay.ft
                    this.theory.clearGraph()
                }
                return display_ft
            })(),
            display_gt: (()=>{
                const display_gt = this.theory.createPermanentUpgrade(10001, this.currency, new FreeCost())
                display_gt.getDescription = _ => !this.GraphDisplay.gt ? Utils.getMath(`\\text{Display }g(t)\\text{ on graph}`) : Utils.getMath(`\\text{Display }\\rho\\text{ on graph}`)
                display_gt.getInfo = _ => !this.GraphDisplay.gt ? Utils.getMath(`\\text{Displays }g(t)\\text{ on graph}`) : Utils.getMath(`\\text{Displays }\\rho\\text{ on graph}`)
                display_gt.bought = _ => {
                    display_gt.level = 0
                    this.PermanentUpgrades.display_ft.level = 0
                    this.GraphDisplay.ft = false
                    this.GraphDisplay.gt = !this.GraphDisplay.gt
                    this.theory.clearGraph()
                }
                return display_gt
            })(),
            refund_t1: (()=>{
                const multiplier = BigNumber.TEN.sqrt()
                const refund_t1 = this.theory.createPermanentUpgrade(10100, this.currency, new FirstFreeCost(new ExponentialCost(multiplier, multiplier)))
                refund_t1.getDescription = _ => Localization.getUpgradeDecCustomDesc(`t_1\\text{ level}`, 1)
                refund_t1.getInfo = _ => Localization.getUpgradeDecCustomInfo(`t_1\\text{ level}`, 1)
                refund_t1.bought = _ => {
                    if (t1.level <= 0) {
                        refund_t1.level--
                        this.currency.value += refund_t1.cost.getCost(refund_t1.level)
                        return
                    }
                    this.Upgrades.t1.level--
                    this.currency.value += this.Upgrades.t1.cost.getCost(t1.level)
                }
                return refund_t1
            })()
        }
        this.SingularUpgrades = {
            reset_time: (()=>{
                const getDesc = () => `t\\leftarrow0`
                const reset_time = this.theory.createSingularUpgrade(0, this.currency, new FreeCost())
                reset_time.getDescription = () => Utils.getMath(getDesc())
                reset_time.getInfo = () => Utils.getMath(getDesc())
                reset_time.bought = _ => {
                    reset_time.level = 0
                    this.time = BigNumber.ZERO
                }
                return reset_time
            })()
        }
        this.MilestoneUpgrades = {
            init: this.theory.setMilestoneCost(new CustomCost(
                level => {
                    return BigNumber.from((this.Settings.milestones[level] ?? 0) * this.Settings.tau_rate)
                }
            )),
            unlock_q: (()=>{
                const unlock_q = this.theory.createMilestoneUpgrade(100, 1)
                unlock_q.getDescription = _ => Localization.getUpgradeUnlockDesc(`q`)
                unlock_q.getInfo = _ => Localization.getUpgradeUnlockInfo(`q`)
                unlock_q.canBeRefunded = _ => this.qRefundable
                return unlock_q
            })(),
            increase_drho_multi: (()=>{
                const increase_drho_multi = this.theory.createMilestoneUpgrade(200, 1)
                increase_drho_multi.getDescription = _ => Localization.getUpgradeMultCustomDesc(`\\dot{\\rho}`, this.Settings.milestone_drho_multi)
                increase_drho_multi.getInfo = _ => Localization.getUpgradeMultCustomInfo(`\\dot{\\rho}`, this.Settings.milestone_drho_multi)
                return increase_drho_multi
            })(),
            increase_dq_multi: (()=>{
                const increase_dq_multi = this.theory.createMilestoneUpgrade(300, 1)
                increase_dq_multi.getDescription = _ => Localization.getUpgradeMultCustomDesc(`\\dot{q}`, this.Settings.milestone_dq_multi)
                increase_dq_multi.getInfo = _ => Localization.getUpgradeMultCustomInfo(`\\dot{q}`, this.Settings.milestone_dq_multi)
                return increase_dq_multi
            })()
        }

        this.updateAvailability()
    }

    get primaryEquation() {
        this.theory.primaryEquationHeight = this.r1Available ? 45 : 25
        const result = [
            `\\dot{\\rho}=${this.dotRhoMultiplied ? String(this.Settings.milestone_drho_multi) : ``}q_1q_2${this.qUnlocked ? `q^{0.5}` : ``}f(t)`
        ]
        if (this.r1Available) result.push(`\\dot{q}=\\frac{${this.dotQMultiplied ? String(this.Settings.milestone_dq_multi) : ``}r_1${this.r2Available ? `r_2` : ``}${this.gtAvailable ? `g(t)` : ``}}{q}`)
        return `\\begin{array}{c} ${result.join(`,\\quad `)} \\end{array}`
    }

    get secondaryEquation() {
        this.theory.secondaryEquationHeight = 92
        const result = [
            `${this.theory.latexSymbol}=\\max{\\rho${this.Settings.tau_rate != 1 ? `^{${this.Settings.tau_rate}}` : ``}}`,
            `\\dot{t}=\\begin{cases}t_1, & t<c\\\\${this.PermanentUpgrades.auto_reset.level >= 1 ? `-t` : `c-t`}, & t\\ge c\\end{cases}`,
            `f(t)=\\frac{(c-t)\\sqrt{t}}{c}${this.gtAvailable ? `,\\quad g(t)=\\frac{1}{t}\\int^t_0f(t)dt` : ``}`
        ]
        return `\\begin{array}{c} ${result.join(`\\\\`)} \\end{array}`
    }

    get tertiaryEquation() {
        const result = [
            `\\dot{\\rho}=${this.dot_rho}`,
            `t=${this.t.toString(1)}`,
            `f(t)=${this.ft}`
        ]
        const q_row = [
            `q=${this.q}`,
            `\\dot{q}=${this.dot_q}`
        ]
        if (this.gtAvailable) q_row.push(`g(t)=${this.gt}`)
    
        let result_string = result.join(",\\quad ")
        if (this.qUnlocked) result_string += `\\\\${q_row.join(`,\\quad `)}`
        return `\\begin{array}{c} ${result_string} \\end{array}`
    }

    get tau() {
        return this.currency.value.pow(this.Settings.tau_rate)
    }

    get graphValue() {
        if (this.GraphDisplay.ft) return this.getFtDisplay(time)
        if (this.GraphDisplay.gt) return this.getGtDisplay(time)
        return this.currency.value.sign * (1 + this.currency.value.abs()).log10().toNumber()
    }

    get r1Available() {
        return this.qUnlocked
    }

    get r2Available() {
        return this.PermanentUpgrades.unlock_q_terms.level >= 1 && this.PermanentUpgrades.unlock_q_terms.isAvailable
    }

    get gtAvailable() {
        return this.PermanentUpgrades.unlock_q_terms.level >= 2 && this.PermanentUpgrades.unlock_q_terms.isAvailable
    }

    get dotRhoMultiplied() {
        return this.MilestoneUpgrades.increase_drho_multi.level >= 1
    }

    get dotQMultiplied() {
        return this.MilestoneUpgrades.increase_dq_multi.level >= 1
    }

    get qUnlocked() {
        return this.MilestoneUpgrades.unlock_q.level >= 1
    }

    get qRefundable() {
        return this.MilestoneUpgrades.increase_drho_multi.level == 0 && this.MilestoneUpgrades.increase_dq_multi.level >= 0
    }

    get baseDotRho() {
        return this.getQ1(this.Upgrades.q1.level) * this.getQ2(this.Upgrades.q2.level) * this.getFtValue(this.t)
    }

    get baseDotQ() {
        if (this.MilestoneUpgrades.unlock_q.level < 1) return BigNumber.ZERO
        const r_1 = this.r1Available ? this.getR1(this.Upgrades.r1.level) : BigNumber.ZERO
        const r_2 = this.r2Available ? this.getR2(this.Upgrades.r2.level) : BigNumber.ONE
        const gt = this.gtAvailable ? this.getGtValue(this.t) : BigNumber.ONE
        return r_1 * r_2 * gt / this.q
    }

    getFtValue(time) {
        return (this.getC(this.Upgrades.c.level) - time) / this.getC(this.Upgrades.c.level) * time.sqrt()
    }

    getGtValue(t) {
        return 2 * t.sqrt() / 3 - 2 * t.pow(1.5) / (5 * this.getC(this.Upgrades.c.level)) // Expanded form of definite integral
    }

    getFtDisplay(time) {
        const modifier = this.getC(c.level) / 5
        return ((5 - time / modifier) / 5 * (time / modifier).sqrt()).toNumber()
    }

    getGtDisplay(t) {
        const modifier = this.getC(c.level) / 5
        return (getGtValue(t) / modifier).toNumber()
    }

    getQ1(level) {
        return Utils.getStepwisePowerSum(level, 2, 8, 0)
    }

    getQ2(level) {
        return BigNumber.TWO.pow(level)
    }

    getR1(level) {
        return Utils.getStepwisePowerSum(level, 2, 10, 0)
    }

    getR2(level) {
        return BigNumber.THREE.pow(this.getR2Exponent(level))
    }

    getR2Exponent(level) {
        return BigNumber.ONE * 0.3 * level
    }

    getC(level) {
        return 100 * this.getCMultiplier(level)
    }

    getCMultiplier(level) {
        return Utils.getStepwisePowerSum(level + 1, 2.5, 10, 0)
    }

    getT1(level) {
        return this.getCMultiplier(level) / BigNumber.from(this.Settings.t1_decay_rate).pow(level)
    }

    tick(elapsedTime, multiplier) {
        let dt = BigNumber.from(elapsedTime * multiplier)
        let bonus = BigNumber.from(theory.publicationMultiplier)

        this.t += this.t >= this.getC(this.Upgrades.c.level) ? (this.PermanentUpgrades.auto_reset.level >= 1 ? -this.t : (this.getC(c.level) - this.t)) : (dt * this.getT1(this.Upgrades.t1.level))
        this.t = this.t.min(this.getC(this.Upgrades.c.level))
        this.ft = this.getFtValue(this.t)
        this.gt = this.getGtValue(this.t)
        this.dot_rho = bonus * this.baseDotRho * (this.dotRhoMultiplied ? this.Settings.milestone_drho_multi : 1) * (this.qUnlocked ? this.q.sqrt() : 1)
        this.dot_q = this.baseDotQ * (this.dotQMultiplied ? this.Settings.milestone_dq_multi : 1)

        try {
            this.currency.value += dt * this.dot_rho
            this.q += dt * this.dot_q
            this.q = this.q.max(BigNumber.ONE)
        } catch (exception) {
            throw new Error(`Error:\n${exception}\n\nDebug:\n${dt},${this.dot_rho},${this.currency.value},${this.getFtValue(this.t)},${this.getGtValue(this.t)}`)
        }

        theory.invalidatePrimaryEquation()
        theory.invalidateSecondaryEquation()
        theory.invalidateTertiaryEquation()

        this.updateAvailability()
    }

    updateAvailability() {
        this.Upgrades.r1.isAvailable = this.r1Available
        this.Upgrades.r2.isAvailable = this.r2Available

        this.PermanentUpgrades.unlock_q_terms.isAvailable = this.qUnlocked
        this.MilestoneUpgrades.increase_drho_multi.isAvailable = this.MilestoneUpgrades.increase_dq_multi.isAvailable = this.qUnlocked

        this.PermanentUpgrades.display_ft.isAvailable = !this.GraphDisplay.gt
        this.PermanentUpgrades.display_gt.isAvailable = !this.GraphDisplay.ft
    }

    getPublicationMultiplier(tau) {
        return (tau / BigNumber.TEN.pow(this.Settings.publication_divide_power * this.Settings.tau_rate)).pow(0.15 / this.Settings.tau_rate)
    }

    getPublicationMultiplierFormula(symbol) {
        return `(\\frac{${symbol}}{10^{${this.Settings.publication_divide_power * this.Settings.tau_rate}}})^{${0.15 / this.Settings.tau_rate}}`
    }

    getCurrencyFromTau(tau) {
        return [tau.max(BigNumber.ONE).pow(BigNumber.ONE / this.Settings.tau_rate), this.currency.symbol]
    }

    getInternalState() {
        return JSON.stringify({
            t: this.t.toBase64String(),
            q: this.q.toBase64String()
        })
    }

    setInternalState(string) {
        if (!string) return
        const state = JSON.parse(string)
        
        const t_state = state.t ?? BigNumber.ZERO.toBase64String()
        this.t = BigNumber.fromBase64String(t_state)
        const q_state = state.q ?? BigNumber.ONE.toBase64String()
        this.q = BigNumber.fromBase64String(q_state).max(BigNumber.ONE)
    }

    postPublish() {
        this.t = BigNumber.ZERO
        this.q = BigNumber.ONE
    }
}

const Theory = new CurveOfTime()

var tick = (elapsedTime, multiplier) => Theory.tick(elapsedTime, multiplier)
var getPrimaryEquation = () => Theory.primaryEquation
var getSecondaryEquation = () => Theory.secondaryEquation
var getTertiaryEquation = () => Theory.tertiaryEquation
var getPublicationMultiplier = tau => Theory.getPublicationMultiplier(tau)
var getPublicationMultiplierFormula = symbol => Theory.getPublicationMultiplierFormula(symbol)
var getCurrencyFromTau = tau => Theory.getCurrencyFromTau(tau)
var getTau = () => Theory.tau
var get2DGraphValue = () => Theory.graphValue
var getInternalState = () => Theory.getInternalState()
var setInternalState = string => Theory.setInternalState(string)
var postPublish = () => Theory.postPublish()