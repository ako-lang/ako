import ohm from 'ohm-js'
import * as AkoElement from './elements'

export function getGrammar(akoGrammar: string) {
  const grammar = ohm.grammar(akoGrammar)
  const semantics = grammar.createSemantics()

  semantics.addOperation('calc', {
    int: function (_) {
      return parseInt(this.sourceString, 10)
    },
    float: function (_, __, ___) {
      return parseFloat(this.sourceString)
    },
    hex: function (_, __) {
      return Number(`0x${this.sourceString.slice(1)}`)
    }
  })

  const debugWrapper = (start, end, res) => {
    const src = start.source.sourceString
    const line = src.substring(0, start.source.startIdx).split('\n').length - 1
    const sample = src.substring(start.source.startIdx, end.source.endIdx)
    const before = src.substring(start.source.startIdx - 10 > 0 ? start.source.startIdx - 10 : 0, start.source.startIdx)
    const after = src.substring(end.source.endIdx, end.source.endIdx + 10)

    res.debug = {
      line,
      sample_before: before,
      sample_after: after,
      sample
    }
    return res
  }

  const ASTBuilder = semantics.addOperation('toAST', {
    // Operator
    EqExpr_eq: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('==', a.toAST(), c.toAST())),
    EqExpr_neq: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('!=', a.toAST(), c.toAST())),
    EqExpr_lt: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('<', a.toAST(), c.toAST())),
    EqExpr_lte: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('<=', a.toAST(), c.toAST())),
    EqExpr_gt: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('>', a.toAST(), c.toAST())),
    EqExpr_gte: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('>=', a.toAST(), c.toAST())),
    BinExpr_and: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('and', a.toAST(), c.toAST())),
    BinExpr_or: (a, _, c) => debugWrapper(a, c, AkoElement.Operator.create('or', a.toAST(), c.toAST())),

    AddExpr_plus: (a, _, c) => debugWrapper(a, c, AkoElement.MathOp.create('+', a.toAST(), c.toAST())),
    AddExpr_minus: (a, _, c) => debugWrapper(a, c, AkoElement.MathOp.create('-', a.toAST(), c.toAST())),
    MulExpr_times: (a, _, c) => debugWrapper(a, c, AkoElement.MathOp.create('*', a.toAST(), c.toAST())),
    MulExpr_divide: (a, _, c) => debugWrapper(a, c, AkoElement.MathOp.create('/', a.toAST(), c.toAST())),
    MulExpr_mod: (a, _, c) => debugWrapper(a, c, AkoElement.MathOp.create('%', a.toAST(), c.toAST())),

    // Type
    Number: (a) => debugWrapper(a, a, AkoElement.Number.create(a.calc())),
    bool: (a) => debugWrapper(a, a, AkoElement.Number.create(a.sourceString === 'true' ? 1 : 0)),
    sqString: (a, b, c) => debugWrapper(a, c, AkoElement.String.create(b.sourceString)),
    dqString: (a, b, c) => debugWrapper(a, c, AkoElement.String.create(b.sourceString)),
    emptyString: (a) => debugWrapper(a, a, AkoElement.String.create('')),
    PriExpr_paren: (_, a, __) => debugWrapper(a, a, a.toAST()),
    // PriExpr_pos: (_, a) => AkoElement.Number.create(+a.calc()),
    PriExpr_neg: (_, a) => debugWrapper(a, a, AkoElement.Number.create(-a.calc())),

    // Conditional
    If: (_, ifCond, ifBlock, __, elifCond, elifBlock, ___, elseBlock) =>
      debugWrapper(
        ifCond,
        elseBlock,
        AkoElement.If.create(ifCond.toAST(), ifBlock.toAST(), elifCond.toAST(), elifBlock.toAST(), elseBlock.toAST())
      ),

    // List
    Array: (a, b, c) => debugWrapper(a, c, AkoElement.Array.create(b.asIteration().toAST())),
    Dictionary: (a, b, c) => debugWrapper(a, c, AkoElement.Dictionary.create(b.asIteration().toAST())),
    KeyValue: (a, _, c) => debugWrapper(a, c, AkoElement.KeyValue.create(a.toAST(), c.toAST())),

    //
    Task: (a, b, _, f, g) => debugWrapper(a, g, AkoElement.Task.create(b.asIteration().toAST(), f.toAST(), false)),
    SkipTask: (a, b, _, f, g) => debugWrapper(a, g, AkoElement.Task.create(b.asIteration().toAST(), f.toAST(), true)),
    TaskDef: (a, b, c, d) => debugWrapper(a, d, AkoElement.TaskDef.create(b.toAST(), c.toAST(), d.toAST())),
    Fn: (a, _, e, f) => debugWrapper(a, f, AkoElement.Function.create(a.toAST(), e.toAST())),
    Arguments: (a) => debugWrapper(a, a, a.asIteration().toAST()),
    ListOf: (a) => debugWrapper(a, a, a.asIteration().toAST()),
    Pipe: (a, _, c) => debugWrapper(a, c, AkoElement.Pipe.create(a.toAST(), c.toAST())),
    Metadata: (a, b, c) => debugWrapper(a, c, AkoElement.Metadata.create(b.toAST(), c.toAST())),

    // Assign
    AssignTask: (a, _, c) => debugWrapper(a, c, AkoElement.AssignTask.create('=', a.toAST(), c.toAST())),
    AssignLeft: (a, _, c) => debugWrapper(a, c, AkoElement.Assign.create('=', a.toAST(), c.toAST())),
    AssignAdd: (a, _, c) => debugWrapper(a, c, AkoElement.Assign.create('+=', a.toAST(), c.toAST())),
    AssignSub: (a, _, c) => debugWrapper(a, c, AkoElement.Assign.create('-=', a.toAST(), c.toAST())),
    AssignIncr: (a, _) => debugWrapper(a, a, AkoElement.Assign.create('+=', a.toAST(), AkoElement.Number.create(1))),
    AssignDecr: (a, _) => debugWrapper(a, a, AkoElement.Assign.create('-=', a.toAST(), AkoElement.Number.create(1))),

    // Loop
    Infinite: (a, b) => debugWrapper(a, b, AkoElement.LoopInfinite.create(b.toAST())),
    While: (a, b, c) => debugWrapper(a, c, AkoElement.LoopWhile.create(b.toAST(), c.toAST())),
    Foreach: (a, b, _, d, __, f, g) => debugWrapper(a, g, AkoElement.LoopFor.create(b.toAST(), d.toAST(), f.toAST(), g.toAST())),
    Block: (a, b, c) => debugWrapper(a, c, AkoElement.Block.create(b.toAST())),
    // Lambda: (a, b, c, d, e) => {
    //     console.log(e.sourceString)
    //     return AkoElement.Lambda.create(b.toAST(), e.toAST())
    // },
    LambdaInline: (a, b, _, __, e) => debugWrapper(a, e, AkoElement.Lambda.create(b.toAST(), e.toAST())),
    Continue: (a) => debugWrapper(a, a, AkoElement.Continue.create()),
    Return: (a, b) => debugWrapper(a, b, AkoElement.Return.create(b.toAST())),

    // Var
    comment: (a) => debugWrapper(a, a, AkoElement.Comment.create(a.sourceString)),
    id: (a) => debugWrapper(a, a, AkoElement.String.create(a.sourceString)),
    Var_single: (a) => debugWrapper(a, a, AkoElement.Symbol.create(a.sourceString)),
    Var_select: (a, _, c) => debugWrapper(a, c, AkoElement.SymbolSelect.create(a.toAST(), c.toAST())),
    Var_range: (a, _, c, __, e, f) => debugWrapper(a, f, AkoElement.SymbolRange.create(a.toAST(), c.toAST(), e.toAST())),
    Var_subscript: (a, _, c, d) => debugWrapper(a, d, AkoElement.SymbolSub.create(a.toAST(), c.toAST())),
    Last: (a) => debugWrapper(a, a, AkoElement.SymbolLast.create())
  })

  return {grammar, semantics, ASTBuilder}
}
