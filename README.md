![logo](./logo.png)

[![NPM Version](https://img.shields.io/npm/v/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![NPM Download](https://img.shields.io/npm/dm/ako-lang.svg)](https://npmjs.org/package/ako-lang)
[![CDN Download](https://data.jsdelivr.com/v1/package/npm/ako-lang/badge)](https://www.jsdelivr.com/package/npm/ako-lang)
[![License](https://img.shields.io/npm/l/ako-lang.svg)](https://npmjs.org/package/ako-lang)

# AKO Language

## Description

**AKO** is a programming language built to be used by no-code or low-code tools

**[WIP] Project under construction**

It's a scripting language designed to be embedded in application or webApp

[Language Grammar](./docs/grammar_basic.md) | [Playground](https://codesandbox.io/s/ako-template-2qwb5?file=/src/index.js)

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

### From npm

```sh
# Install Ako interpreter
npm install -g ako-lang

# Execute 
ako ./test.ako
```

### Install the executable

**Soon**

### CDN

**Soon**
