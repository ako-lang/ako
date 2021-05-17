import commander from 'commander'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import gitly from 'gitly'
import {getModulePath} from '../../core'
import {parseDep} from './helpers'

async function depsAdd(manifest: string, data: any) {
  const mod = yaml.load(fs.readFileSync(manifest, 'utf-8'))
  const entryData = parseDep(data)

  let edited = false
  if (!mod.deps) mod.deps = []
  const entry = mod.deps.find((x) => parseDep(x).url === entryData.url)
  if (entry) {
    Object.assign(entry, entryData)
    edited = true
  }
  if (!edited) mod.deps.push(entryData)

  // yaml
  fs.writeFileSync(manifest, yaml.dump(mod))
  await install(manifest)
  const entryDep = mod.deps.find((x) => parseDep(x).url === entryData.url)
  if (entryDep && !entryDep.scope) {
    let localPath = entryDep.url
    if (!entryDep.url.startsWith('.')) {
      localPath = getModulePath(entryDep)
    }
    if ('path' in entryDep) localPath = path.join(localPath, entryDep.path)
    localPath = path.join(localPath, 'manifest.yaml')
    const depmod = yaml.load(fs.readFileSync(localPath, 'utf-8'))
    entryDep.scope = depmod.id
    fs.writeFileSync(manifest, yaml.dump(mod))
  }
}

async function depsRemove(manifest: string, url: string) {
  const mod = yaml.load(fs.readFileSync(manifest, 'utf-8'))
  const entry = parseDep(url)

  if (!mod.deps) mod.deps = []
  mod.deps = mod.deps.filter((x) => x.url === entry.url || x.url.includes(entry.url))

  // yaml
  fs.writeFileSync(manifest, yaml.dump(mod))
}

async function install(manifestPath: string) {
  const mod = yaml.load(fs.readFileSync(manifestPath, 'utf-8'))
  for (const dep of mod.deps) {
    const dependency = parseDep(dep)
    if (!('url' in dependency)) continue
    if (dependency.url.startsWith('.')) {
      const libpath = path.join(path.dirname(manifestPath), dependency.url)
      const targetManifest = path.join(libpath, 'path' in dependency ? dependency.path : '', 'manifest.yaml')
      if (fs.existsSync(targetManifest)) await install(targetManifest)
    } else {
      const libpath = getModulePath(dependency)
      const targetManifest = path.join(libpath, 'path' in dependency ? dependency.path : '', 'manifest.yaml')
      if (!fs.existsSync(targetManifest)) {
        const res = await gitly(dependency.url, libpath, {})
        if (!res || !res[0]) console.warn('Cannot install', dependency.url)
      }
      if (fs.existsSync(targetManifest)) await install(targetManifest)
    }
  }
}

/**
 * Manage Dependencies
 */
export function makeDepsCommands(): commander.Command {
  const parent = new commander.Command('deps').description('Manage dependencies')
  parent
    .command('install')
    .description('Install defined dependencies')
    .option('-f, --force', 'Force to download and install dependencies')
    .action(async () => {
      console.log('* Dependency Install')
      const source = path.join('.', 'manifest.yaml')
      if (!source || !fs.existsSync(source)) throw new Error(`File does not exists : ${source}`)
      await install(source)
    })

  parent
    .command('add <source>')
    .description(
      `Add a dependency to the module
    -> ako deps add ../../my-lib
    -> ako deps add github:group/repo#branch
    -> ako deps add gitlab:group/repo#branch --scope LIB --path myfolder/ako/
    -> ako deps add LIB=http://mydomain.com/thisismyrepo.git`
    )
    .option('-s, --scope <scope>')
    .option('-p, --path <path>')
    .action(async (name: string, args: any) => {
      console.log('* Dependency Add -> ', parseDep(Object.assign({url: name}, args)))
      const source = path.join('.', 'manifest.yaml')
      if (!source || !fs.existsSync(source)) throw new Error(`File does not exists : ${source}`)
      await depsAdd(source, Object.assign({url: name}, args))
    })

  parent
    .command('remove <source>')
    .description('Delete a dependency from the module')
    .action(async (name: string) => {
      console.log('* Dependency Remove')
      const source = path.join('.', 'manifest.yaml')
      if (!source || !fs.existsSync(source)) throw new Error(`File does not exists : ${source}`)
      await depsRemove(source, name)
    })

  return parent
}
