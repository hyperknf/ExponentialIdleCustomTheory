/*

    USAGE POLICY

    Permission is given to use this piece of code in any non-profit-making project
    This policy (JavaScript comment) must be included in the project
    This policy is subject to change without prior notice

*/

import { BigNumber } from "./api/BigNumber"

class Complex {
    static from(...args) {
        return new Complex(...args)
    }
    static fromJSON(obj) {
        if (typeof obj != "object") throw new Error("Inputted value is not an object")
        const real = obj.real ?? BigNumber.ZERO.toBase64String()
        const imaginary = obj.imaginary ?? BigNumber.ZERO.toBase64String()
        return new Complex(real, imaginary)
    }

    static get i() {
        return new Complex(0, 1)
    }
    static get e() {
        return new Complex(BigNumber.E)
    }
    static get pi() {
        return new Complex(BigNumber.PI)
    }
    static get one() {
        return new Complex(1)
    }
    static get two() {
        return new Complex(2)
    }
    static get three() {
        return new Complex(3)
    }
    static get four() {
        return new Complex(4)
    }
    static get five() {
        return new Complex(5)
    }
    static get six() {
        return new Complex(6)
    }
    static get seven() {
        return new Complex(7)
    }
    static get eight() {
        return new Complex(8)
    }
    static get nine() {
        return new Complex(9)
    }
    static get ten() {
        return new Complex(10)
    }
    static get hundred() {
        return new Complex(100)
    }
    static get thousand() {
        return new Complex(1000)
    }

    static random() {
        return new Complex(Math.random(), Math.random())
    }

    constructor(real, imaginary) {
        this.real = BigNumber.from(real ?? 0)
        this.imaginary = BigNumber.from(imaginary ?? 0)
    }

    get re() {
        return this.real
    }

    get im() {
        return this.imaginary
    }

    set re(value) {
        return this.real = BigNumber.from(value)
    }

    set im(value) {
        return this.imaginary = BigNumber.from(value)
    }

    get quadrant() {
        if (this.real > BigNumber.ZERO) {
            if (this.imaginary > BigNumber.ZERO) return 1
            if (this.imaginary < BigNumber.ZERO) return 2
            else return 0
        } else {
            if (this.imaginary > BigNumber.ZERO) return 4
            if (this.imaginary < BigNumber.ZERO) return 3
            else return 0
        }
    }

    create(real, imaginary) {
        return new Complex(real ?? BigNumber.ZERO, imaginary ?? BigNumber.ZERO)
    }

    validate(number) {
        if (typeof number == "number") return this.create(number)
        return this.create(number.real ?? 0, number.imaginary ?? 0)
    }

    clone() {
        return this
    }

    abs() {
        return (this.real.square() + this.imaginary.square()).sqrt()
    }

    add(right) {
        const other = this.validate(right)
        return this.create(this.real + other.real, this.imaginary + other.imaginary)
    }

    sub(right) {
        const other = this.validate(right)
        return this.create(this.real - other.real, this.imaginary - other.imaginary)
    }

    mul(right) {
        const other = this.validate(right)

        const real = this.real * other.real - this.imaginary * other.imaginary
        const imaginary = this.imaginary * other.real + this.real * other.imaginary
        return this.create(real, imaginary)
    }

    div(right) {
        const other = this.validate(right)

        const denominator = other.real.square() + other.imaginary.square()
        const real = (this.real * other.real + this.real * other.imaginary) / denominator
        const imaginary = (this.imaginary * other.real - this.real * other.imaginary) / denominator
        return this.create(real, imaginary)
    }

    exp() {
        return Complex.e.pow(this)
    }

    exp2() {
        return Complex.two.pow(this)
    }

    exp10() {
        return Complex.ten.pow(this)
    }

    inverse() {
        return this.create(1).div(this)
    }

    log() {
        const magnitude = this.abs()
        const angle = this.atan2()
        return this.create(magnitude.log(), angle)
    }

    log2() {
        return this.log() / Complex.two.log()
    }

    log10() {
        return this.log() / Complex.ten.log()
    }

    sqrt() {
        return this.pow(0.5)
    }

    cbrt() {
        return this.pow(1 / 3)
    }

    sq() {
        return this.pow(2)
    }

    cb() {
        return this.pow(3)
    }

    pow(right) {
        const other = this.validate(right)

        const log_base = this.log()
        const result_magnitude = BigNumber.E.pow(other.real * log_base.real - other.imaginary * log_base.imaginary)
        const result_angle = other.imaginary * log_base.real + other.real * log_base.imaginary

        return this.create(result_magnitude * Math.cos(result_angle), result_magnitude * Math.sin(result_angle))
    }

    atan2() {
        if (this.real == BigNumber.ZERO) {
            if (this.imaginary > BigNumber.ZERO) {
                return BigNumber.PI / 2
            } else if (this.imaginary < BigNumber.ZERO) {
                return -BigNumber.PI / 2
            } else {
                return undefined
            }
        }

        const ratio = this.imaginary.abs() / this.real.abs()
        let angle

        if (this.real.abs() > this.imaginary.abs()) angle = Math.atan(ratio)
        else angle = BigNumber.PI / 2 - Math.atan(1 / ratio)
        if (this.real < BigNumber.ZERO) angle = BigNumber.PI - angle
        if (this.imaginary < BigNumber.ZERO) angle = -angle

        return angle
    }

    conj() {
        return this.create(this.real, -this.imaginary)
    }

    flip() {
        return this.create(-this.real, -this.imaginary)
    }

    toString(dec) {
        const decimals = dec ?? 0
        if (this.imaginary == BigNumber.ZERO) return this.real.toString(decimals)
        if (this.real == BigNumber.ZERO) return `${this.imaginary.toString(decimals)}i`
        return `${this.real}+${this.imaginary}i`
    }

    valueOf() {
        return this.abs()
    }

    toJSON() {
        return {
            real: this.real.toBase64String(),
            imaginary: this.real.toBase64String()
        }
    }
}

export default Complex