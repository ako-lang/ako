import commander from 'commander'
import fs from 'fs'
import path from 'path'

export function makeNewCommands(program: commander.Command): void {
  program
    .command('new <name>')
    .description('Create a new Ako Module')
    .action((name: string) => {
      const filepath = path.resolve('.', name)
      if (fs.existsSync(filepath)) throw new Error(`Folder ${filepath} already exist`)

      fs.mkdirSync(filepath)

      fs.mkdirSync(path.join(filepath, 'src'))
      fs.mkdirSync(path.join(filepath, 'assets'))
      fs.writeFileSync(
        path.join(filepath, 'manifest.yaml'),
        `id: "${name}"
description: "My description"
entry:
- src/index.ako
`
      )
      fs.writeFileSync(
        path.join(filepath, 'Readme.md'),
        `# ${name}

## Description
This is a [Ako module](https://github.com/ako-lang/ako)

## Commands
\`\`\`sh
ako install
ako run
\`\`\`
`
      )
      fs.writeFileSync(
        path.join(filepath, 'src', 'index.ako'),
        `name = "World"
@print("Hello {name}!")
`
      )
    })
}
