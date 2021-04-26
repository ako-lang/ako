# AKO Language

## Description

**AKO** is a programming language built to be used by no-code or low-code tools

It's designed to be embedded in application or webApp.

[Language Grammar](./docs/grammar_basic.md)

## Design decision

This language can look similar to other existing language, but it has some specifities.
The 2 main goals are to:
* Make the language easy to learn and use for beginner
* Make a language that can easily be represented visually

So this lead to some decision:
* Built around expression (think about excel formula)
* Only one loop `For` (no while, foreach, ...)
* Simple scope design, 1 file = 1 scope
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
