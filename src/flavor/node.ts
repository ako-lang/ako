import { getGrammar } from '../semantic'
import { Interpreter } from '../interpreter'

const { grammar, ASTBuilder } = getGrammar()

const toAst = (codeTxt: string) => {
    const match = grammar.match(codeTxt.toString())
    if (!match) throw new Error(`Syntax Error`)
    return ASTBuilder(match).toAST()
}
export { toAst, Interpreter }