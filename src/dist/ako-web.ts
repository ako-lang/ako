import {getGrammar} from '../semantic'
import {Interpreter} from '../interpreter'
import akoGrammar from '../../ako_grammar.txt'

const {grammar, ASTBuilder} = getGrammar(akoGrammar)

const toAst = (codeTxt: string) => {
  const match = grammar.match(codeTxt.toString())
  if (!match) throw new Error(`Syntax Error`)
  return ASTBuilder(match).toAST()
}
export {toAst, Interpreter}
