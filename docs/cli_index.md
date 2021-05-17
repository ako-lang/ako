# AKO CLI

## Create a new module

This will create a new module folder structure with this name

```
ako new [name of your module]
```

## Run some code

Execute a script or a module

```bash
ako run ./file.ako

# or a manifest
ako run ./manifest.yaml

# or in a project
ako run
```

# Manage dependencies

## Install dependencies
Install dependencies declared in the manifest file
```bash
ako deps install
```

## Add dependency
Add a dependency to the manifest, download and unzip the necessary files
```bash
ako deps add [path]
```
### Supported path:
* Filepath: ```ako deps add ./path/on/your/system```
* Github: ```ako deps add github_organization/repo```
  * with branch: ```ako deps add github_organization/repo#develop```
  * or tags: ```ako deps add github_organization/repo#v1.0.0```
* Gitlab: ```ako deps add gitlab:organization/repo```

### Options:
* -p, --path : If needed, can use a subfolder of a repository
* -s, --scope : Name used to expose this module in your ako code

## Remove dependency
```bash
ako deps remove [path]
```
