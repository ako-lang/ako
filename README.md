![logo](https://raw.githubusercontent.com/ako-lang/ako/master/logo.png)

[![NPM Version](https://img.shields.io/npm/v/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![NPM Download](https://img.shields.io/npm/dm/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![CDN Download](https://data.jsdelivr.com/v1/package/npm/ako-lang/badge)](https://www.jsdelivr.com/package/npm/ako-lang)
[![License](https://img.shields.io/npm/l/ako-lang.svg)](https://npmjs.org/package/ako-lang)

# AKO Language

## Description

**AKO** is a programming language built to be used by no-code or low-code tools

**[WIP] Project under construction**

It's a scripting language designed to be embedded in application or webApp

[Language](https://ako-lang.github.io/ako/index.html#/./docs/grammar_basic) | [Playground](https://codesandbox.io/s/ako-template-2qwb5?file=/src/index.js)

## Goals
The 2 main goals are
* Make the language easy to learn and use for beginner
* Make a language that can easily be represented visually in UI land

## Design decision
For those reasons, **Ako** tries to stay simple
* Built around expressions (think about excel formula)
* Simple scope design, 1file = 1task = 1scope
* Sequential execution (no callback or async/await)
* No class or OOP (no `this`, `self` or `object` scope)
* Only one loop `For` (no while, foreach, ...)
* No switch, goto, try/catch, ...
* The code should be modular and easy to share and reuse

---

## Getting Started

### From NPM

```sh
# Install Ako interpreter
npm install -g ako-lang

# Execute 
ako ./test.ako
```

### Standalone Executable

You can directly use standalone executable of the interpreter : [Release page](https://github.com/ako-lang/ako/releases)

It's compiled for **Windows**, **Mac** and **Linux** and once downloaded, you can use it to run Ako scripts
```sh
./ako.exe test.ako
```

### CDN

For web usage, you can load the library directly with ESM imports
```js
import * as Ako from 'https://cdn.jsdelivr.net/npm/ako-lang@0.0.5/dist/web/ako-web.js'
```
