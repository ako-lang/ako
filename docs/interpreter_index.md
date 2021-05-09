# Interpreter

The interpreter is one of the most important part of the language

it takes care of executing the code and keeping the state (variable, task execution, ...)

```js
const { toAst, Interpreter } = require("ako-lang")

const ast = toAst(`some ako code`)

// Create an interpreter and run the code
const interpreter = new Interpreter()
interpreter.createStack(code)
// Or create a task definition for @main
interpreter.addFile('main', code)
```

An interpreter can execute multiple stack in parallel

# Update Loop
By default, interpreter are just running synchronous code, they need to be updated for asynchronous code.

You can update at the pace you want, if you just want to run code:
```js
// those will update the interpreter 50 time per second

// in milliseconds
setInterval(() => interpreter.update(20), 20)
@sleep(1000) // 1s

// or in seconds
setInterval(() => interpreter.update(0.02), 20)
@sleep(1) // 1s
```

Obviously, if you already have an update loop (like requestAnimationFrame), its recommended to update the interpreter at the same speed.

And if you stop updating the interpreter, the code will just pause where it is

So by just playing with the update:
* you can slow down / speed up the execution
* you can pause / resume the execution

# State Machine
A interpreter state can be serialized and reloaded later

```js
const state = JSON.stringify(interpreter.getState())

//...
const interpreter2 = new Interpreter()
interpreter.setState(JSON.parse(state))
```

All the stacks, running tasks, variables are kept as they are.
