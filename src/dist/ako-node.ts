import {getGrammar} from '../semantic'
import {Interpreter} from '../interpreter'
import {Analyzer} from '../analyzer'
import fs from 'fs'
import path from 'path'

const grammarPaths = ['../ako_grammar.txt', '../../ako_grammar.txt', '../src/ako_grammar.txt']
const grammarPath = grammarPaths.find((x) => fs.existsSync(path.resolve(__dirname, x)))
if (!grammarPath) throw new Error('Cant locate Ako Grammar file')
const akoGrammar = fs.readFileSync(path.resolve(__dirname, grammarPath), 'utf-8')

const {grammar, ASTBuilder} = getGrammar(akoGrammar)

const toAst = (codeTxt: string) => {
  const match = grammar.match(codeTxt.toString())
  if (!match) throw new Error(`Syntax Error`)
  return ASTBuilder(match).toAST()
}
export {toAst, Interpreter, Analyzer}
