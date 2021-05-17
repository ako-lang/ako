# Module

## Description
Ako encourage reusability by organizing code in standalone modules.

Each module contains:
* Ako scripts
* Assets
* Native function/tasks

All the configuration is all provided by the `manifest.yaml` at the root

## Structure
the recommended file structure is
* `manifest.yaml` : Module manifest
* `./src/` : Ako code folder
* `./assets/` : Assets that can be required by Ako code
* `./lib/` : Native function or task implementation

it can be customized in manifest

Look the [CLI dependencies](./cli_index.md) if you want to want to create module with `ako new [name]`

## Dependencies
Any module can load 3rd party code by declaring dependencies. Those dependencies can be loaded localy on your file system, or downloaded from git services like github/gitlab.

Look the [CLI dependencies](./cli_index.md) if you want to add a dependency to your project.

### Example:
```yaml
id: Test
entry:
  - main.ako
deps:
  - url: ./path/module
    scope: MODULE
```
This module under `./path/module` will be loaded in a dedicated scope `MODULE.`and you can call any of his task or function. `@MODULE.main()`

By default, the scope is the `id` of this dependency, but it can be renamed to avoid conflict
