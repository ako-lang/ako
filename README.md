![logo](https://raw.githubusercontent.com/ako-lang/ako/master/logo.png)

[![NPM Version](https://img.shields.io/npm/v/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![NPM Download](https://img.shields.io/npm/dm/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![CDN Download](https://data.jsdelivr.com/v1/package/npm/ako-lang/badge)](https://www.jsdelivr.com/package/npm/ako-lang)
[![License](https://img.shields.io/npm/l/ako-lang.svg)](https://npmjs.org/package/ako-lang)

# AKO Language [**WIP**]

**AKO** is a programming language built to be used by no-code or low-code tools

It's a simple scripting language designed to be embedded in application or webApp

**[
[Documentation](https://ako-lang.github.io/ako/index.html#/./docs/grammar_basic) | [Playground](https://codesandbox.io/s/ako-template-2qwb5?file=/src/index.js)
]**

---

## Problem & Goals

Most [No-code or Low-code](https://en.wikipedia.org/wiki/Low-code_development_platform) existing solution have big limitations:
* Bloaty and complicated
* closed source, so it can be hard to contribute or add custom logic
* their own UI that can be really frustrating for more advanced user (like blockly)
* the code is usually stored in a proprietary text format (JSON, YAML or XML) and is not portable or reusable

Ako tries to fill the gap by providing at the same time:
* A visual programming interface for beginners
* A programming language for more advanced users but easy to learn
* An interpreter designed to run almost anywhere

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

---

## How to write Ako scripts ?

For that, please take a look at our [Documentation](https://ako-lang.github.io/ako/index.html#/./docs/grammar_basic)