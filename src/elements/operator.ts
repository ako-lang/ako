import { precisionRound } from "../std/math"

export const Operator = {
    create: (operator, expr1, expr2) => {
        return { type: 'Operator', operator, expr1, expr2 }
    },
    evaluate: (ctx, entry) => {
        const val1 = ctx.vm.evaluate(ctx, entry.expr1, true)
        const val2 = ctx.vm.evaluate(ctx, entry.expr2, true)
        switch (entry.operator) {
            case '==':  return (val1 == val2) ? 1 : 0
            case '!=':  return (val1 != val2) ? 1 : 0
            case '>':  return (val1 > val2) ? 1 : 0
            case '>=':  return (val1 >= val2) ? 1 : 0
            case '<':  return (val1 < val2) ? 1 : 0
            case '<=':  return (val1 <= val2) ? 1 : 0
            case 'and':  return (val1 && val2) ? 1 : 0
            case 'or':  return (val1 || val2) ? 1 : 0
        }
        return false
    }
}

export const MathOp = {
    create: (operator, expr1, expr2) => {
        return { type: 'MathOp', operator, expr1, expr2 }
    },
    evaluate: (ctx, entry) => {
        const val1 = ctx.vm.evaluate(ctx, entry.expr1, true)
        const val2 = ctx.vm.evaluate(ctx, entry.expr2, true)
        switch (entry.operator) {
            case '+':  return precisionRound(+val1 + +val2)
            case '-':  return precisionRound(+val1 - +val2)
            case '*':  return precisionRound(+val1 * +val2)
            case '/':  return precisionRound(+val1 / +val2)
            case '%':  return precisionRound(Math.abs(+val1) % +val2)
        }
        return false
    }
}
