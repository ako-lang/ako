import {getGrammar} from '../semantic'
import {Interpreter} from '../interpreter'
import fs from 'fs'
import path from 'path'

const akoGrammar = fs.readFileSync(path.resolve(__dirname, '../ako_grammar.txt'), 'utf-8')

const {grammar, ASTBuilder} = getGrammar(akoGrammar)

const toAst = (codeTxt: string) => {
  const match = grammar.match(codeTxt.toString())
  if (!match) throw new Error(`Syntax Error`)
  return ASTBuilder(match).toAST()
}
export {toAst, Interpreter}
