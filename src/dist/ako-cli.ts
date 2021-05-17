import commander from 'commander'
import {makeRunCommands} from './cli/cli-run'
import {makeDepsCommands} from './cli/cli-deps'
import {makeNewCommands} from './cli/cli-new'

// process CLI parameters
const program = new commander.Command()
program.name('ako')
program.version('0.0.15')

program.addCommand(makeDepsCommands())
makeRunCommands(program)
makeNewCommands(program)
program.parse(process.argv)
