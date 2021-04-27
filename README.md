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

[Language Grammar](./docs/grammar_basic.md)

## Goals
The 2 main goals are to:
* Make the language easy to learn and use for beginner
* Make a language that can easily be represented visually in UI land

## Design decision
This language tries to stay simple:
* Built around expressions (think about excel formula)
* Only one loop `For` (no while, foreach, ...)
* No switch, goto, try/catch, ...
* Simple scope design, 1file = 1task = 1scope
* No callback or async/await
* No class or OOP (no `this`, `self` or `object` scope)
* Provide a way to share and reuse components

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
