/*

    USAGE POLICY

    Permission is given to use this piece of code in any non-profit-making project
    This policy (JavaScript comment) must be included in the project
    This policy is subject to change without prior notice

*/

import { BigNumber } from "./api/BigNumber"

class SuperExponentialCost {
    constructor(original, base, increment) {
        this.a = BigNumber.from(original)
        this.c = BigNumber.from(base)
        this.d = BigNumber.from(increment)
    }

    cost(level) {
        return this.a * this.c.pow(level) * this.d.pow(0.5 * level * (level + 1))
    }

    cumulative_cost(level, amount) {
        let result = BigNumber.ZERO
        for (let i = 0; i < amount; i++) result += this.cost(level + i)
        return result
    }

    max(level, currency) {
        let cumulative = BigNumber.ZERO
        let current_level = level
        while (cumulative < currency) {
            cumulative += this.cost(current_level)
            current_level++
        }
        return Math.round(current_level - level - 1)
    }

    get functions() {
        return [
            level => this.cost(level)/*,
            (level, amount) => this.cumulative_cost(level, amount),
            (level, currency) => ~~this.max(level, currency)*/
        ]
    }

    get cost_model() {
        return new CustomCost(...this.functions)
    }
}

export default SuperExponentialCost