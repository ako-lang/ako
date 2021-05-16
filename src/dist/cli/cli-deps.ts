import commander from 'commander'

function depsAdd(source: string) {
  console.log('Deps Add', source)
}

/**
 * Manage Dependencies
 */
export function makeDepsCommands(): commander.Command {
  const parent = new commander.Command('deps').description('Manage dependencies')
  parent
    .command('install')
    .description('Install defined dependencies')
    .option('-f --force', 'Force to download and install dependencies')
    .action(() => {
      console.log('Install')
    })

  parent.command('add <source>').description('Add a dependency to the module').action(depsAdd)

  parent
    .command('update')
    .description('Check dependencies versions')
    .action(() => console.log('Deps Checks'))
  // .action((source))

  parent
    .command('remove <source>')
    .description('Delete a dependency from the module')
    .action(() => console.log('Deps Delete'))
  // .action((source))

  return parent
}
