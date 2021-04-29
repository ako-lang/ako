import ohm from 'ohm-js'
import * as AkoElement from './elements'

export function getGrammar(akoGrammar: string) {
  const grammar = ohm.grammar(akoGrammar)
  const semantics = grammar.createSemantics()

  semantics.addOperation('calc', {
    int: function (a) {
      return parseInt(this.sourceString, 10)
    },
    float: function (a, b, c) {
      return parseFloat(this.sourceString)
    },
    hex: function (a, b) {
      return parseInt(this.sourceString.substring(2), 16)
    }
  })

  const ASTBuilder = semantics.addOperation('toAST', {
    // Operator
    EqExpr_eq: (a, b, c) => AkoElement.Operator.create('==', a.toAST(), c.toAST()),
    EqExpr_neq: (a, b, c) => AkoElement.Operator.create('!=', a.toAST(), c.toAST()),
    EqExpr_lt: (a, b, c) => AkoElement.Operator.create('<', a.toAST(), c.toAST()),
    EqExpr_lte: (a, b, c) => AkoElement.Operator.create('<=', a.toAST(), c.toAST()),
    EqExpr_gt: (a, b, c) => AkoElement.Operator.create('>', a.toAST(), c.toAST()),
    EqExpr_gte: (a, b, c) => AkoElement.Operator.create('>=', a.toAST(), c.toAST()),
    BinExpr_and: (a, b, c) => AkoElement.Operator.create('and', a.toAST(), c.toAST()),
    BinExpr_or: (a, b, c) => AkoElement.Operator.create('or', a.toAST(), c.toAST()),

    AddExpr_plus: (a, b, c) => AkoElement.MathOp.create('+', a.toAST(), c.toAST()),
    AddExpr_minus: (a, b, c) => AkoElement.MathOp.create('-', a.toAST(), c.toAST()),
    MulExpr_times: (a, b, c) => AkoElement.MathOp.create('*', a.toAST(), c.toAST()),
    MulExpr_divide: (a, b, c) => AkoElement.MathOp.create('/', a.toAST(), c.toAST()),
    MulExpr_mod: (a, b, c) => AkoElement.MathOp.create('%', a.toAST(), c.toAST()),

    // Type
    Number: (a) => AkoElement.Number.create(a.calc()),
    bool: (a) => AkoElement.Number.create(a.sourceString === 'true' ? 1 : 0),
    sqString: (a, b, c) => AkoElement.String.create(b.sourceString),
    dqString: (a, b, c) => AkoElement.String.create(b.sourceString),
    emptyString: (a) => AkoElement.String.create(''),
    PriExpr_paren: (_, a, __) => a.toAST(),
    PriExpr_pos: (_, a) => AkoElement.Number.create(+a.calc()),
    PriExpr_neg: (_, a) => AkoElement.Number.create(-a.calc()),

    // Conditional
    If: (_, ifCond, ifBlock, __, elifCond, elifBlock, ___, elseBlock) =>
      AkoElement.If.create(ifCond.toAST(), ifBlock.toAST(), elifCond.toAST(), elifBlock.toAST(), elseBlock.toAST()),

    // List
    Array: (a, b, c) => AkoElement.Array.create(b.asIteration().toAST()),
    Dictionary: (a, b, c) => AkoElement.Dictionary.create(b.asIteration().toAST()),
    KeyValue: (a, _, c) => AkoElement.KeyValue.create(a.toAST(), c.toAST()),

    //
    Task: (a, b, c, d, e, f, g) => AkoElement.Task.create(b.toAST(), d.toAST(), f.toAST()),
    TaskDef: (a, b, c) => AkoElement.TaskDef.create(b.toAST(), c.toAST()),
    Fn: (a, b, c, d, e, f) => AkoElement.Function.create(a.toAST(), c.toAST(), e.toAST()),
    Arguments: (a) => a.asIteration().toAST(),
    ListOf: (a) => a.asIteration().toAST(),

    // Assign
    AssignTask: (a, _, c) => AkoElement.AssignTask.create('=', a.toAST(), c.toAST()),
    AssignLeft: (a, _, c) => AkoElement.Assign.create('=', a.toAST(), c.toAST()),
    AssignAdd: (a, _, c) => AkoElement.Assign.create('+=', a.toAST(), c.toAST()),
    AssignIncr: (a, _) => AkoElement.Assign.create('+=', a.toAST(), AkoElement.Number.create(1)),
    AssignDecr: (a, _) => AkoElement.Assign.create('+=', a.toAST(), AkoElement.Number.create(-1)),

    // Loop
    Infinite: (a, b) => AkoElement.LoopInfinite.create(b.toAST()),
    While: (a, b, c) => AkoElement.LoopWhile.create(b.toAST(), c.toAST()),
    Foreach: (a, b, c, d, e, f, g) => AkoElement.LoopFor.create(b.toAST(), d.toAST(), f.toAST(), g.toAST()),
    Block: (a, b, c) => AkoElement.Block.create(b.toAST()),
    // Lambda: (a, b, c, d, e) => {
    //     console.log(e.sourceString)
    //     return AkoElement.Lambda.create(b.toAST(), e.toAST())
    // },
    LambdaInline: (a, b, c, d, e) => AkoElement.Lambda.create(b.toAST(), e.toAST()),
    Continue: (a) => AkoElement.Continue.create(),
    Return: (a, b) => AkoElement.Return.create(b.toAST()),

    // Var
    Id: (a, b) => AkoElement.String.create(a.sourceString + b.sourceString),
    Var_single: (a) => AkoElement.Symbol.create(a.toAST()),
    Var_select: (a, b, c) => AkoElement.SymbolSelect.create(a.toAST(), c.toAST()),
    Var_range: (a, b, c, d, e, f) => AkoElement.SymbolRange.create(a.toAST(), c.toAST(), e.toAST()),
    Var_subscript: (a, b, c, d) => AkoElement.SymbolSub.create(a.toAST(), c.toAST()),
    Last: (a) => AkoElement.SymbolLast.create()
  })

  return {grammar, semantics, ASTBuilder}
}
