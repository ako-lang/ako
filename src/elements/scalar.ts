const regexpVars = /{(?<var>[\w|$]*)}/gi

export const String = {
    create: (value) => {
        return { type: 'String', value }
    },
    evaluate: (ctx, expression) => {
        if (expression.value.indexOf('{') !== -1) {
            let str = expression.value
            const matches = expression.value.matchAll(regexpVars)
            const variables = new Set([...matches].map(x => x[1]))
            variables.forEach(x => {
                if (!ctx.vm.hasData(ctx, x)) return
                str = str.replace(new RegExp((x === '$') ? `{[${x}]}` : `{${x}}`, 'g'), ctx.vm.getData(ctx, x))
            })
            return str
        }
        return expression.value
    }
}

export const Number = {
    create: (value) => {
        return { type: 'Number', value }
    },
    evaluate: (ctx, expression) => {
        return expression.value
    }
}

export const Symbol = {
    create: (value) => {
        return { type: 'Symbol', value }
    },
    evaluate: (ctx, entry, resolve) => {
        const variable = ctx.vm.evaluate(ctx, entry.value, resolve)
        if (variable.type === 'Symbol') return variable
        if (!resolve) return { type: 'Symbol', value: variable }
        return ctx.vm.getData(ctx, variable)
    }
}

export const SymbolLast = {
    create: () => {
        return { type: 'SymbolLast' }
    },
    evaluate: (ctx) => {
        return ctx.vm.getData(ctx, '$')
    }
}

export const SymbolSelect = {
    create: (value, property) => {
        return { type: 'SymbolSelect', value, property }
    },
    evaluate: (ctx, entry, resolve) => {
        // console.log('evaluate', entry)
    }
}

export const SymbolRange = {
    create: (value, from, to) => {
        return { type: 'SymbolRange', value, from, to }
    }
}

export const SymbolSub = {
    create: (value, property) => {
        return { type: 'SymbolSub', value, property }
    },
    evaluate: (ctx, entry, resolve) => {
        const varPath = resolveVar(ctx, entry)
        let current = ctx.vm.getData(ctx, varPath.shift())
        for (let p of varPath) {
            if (!current) continue
            current = current[p]
        }
        return current
    }
}

export const Assign = {
    create: (operator, symbol, value) => {
        return { type: 'Assign', operator, symbol, value }
    },
    execute: (ctx, entry, entryData, time) => {
        const variable = ctx.vm.evaluate(ctx, entry.symbol)
        const value = ctx.vm.evaluate(ctx, entry.value, true)
        if (entry.operator === '=') {
            ctx.vm.setData(ctx, variable.value, value)
        } else if (entry.operator === '+=') {
            ctx.vm.setData(ctx, variable.value, ctx.vm.getData(ctx, variable.value) + value)
        }
        return { timeRemains: time, done: true }
    }
}

function resolveVar (ctx, entry) {
    if (entry.type === 'SymbolSub') {
        return [
            ...resolveVar(ctx, entry.value),
            ctx.vm.evaluate(ctx, entry.property, true)
        ]
    } else if (entry.type === 'SymbolSelect') {
        return [
            ...resolveVar(ctx, entry.value),
            entry.property.value
        ]
    } else if (entry.type === 'Symbol') {
        return [ctx.vm.evaluate(ctx, entry.value)]
    }
}