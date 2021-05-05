# Task

## What is a task ?

A task is an operation that can take a certain amount of time to do things:
* Reading/Writing files
* Playing animations
* Waiting for user inputs

In other language it's often known as `job` or `coroutine`.

And in Ako scripts, they are called with a `@` in front

```js
@print("Hello ...")
@sleep(1) // wait 1s
@print("... there !")
```

## What are the difference between functions and tasks?

#### Functions
* Give a result instantly
* Dont modify the state of the program (change variable, ...)
* Can be chained to build a mathematical expression

```js
a = Math.max(Math.min(0, 1), Math.randInt(-10, 10))
@print("{a}")
```

#### Tasks
* Dont always provide a result instantly
* Cannot be used inside expression
* Can modify the state of the program
* You can use functions as Task parameter

```js
@print(1 + Math.rand())
```

## Calling a task
Per default one task = one file, and every file in a project can be called directly as a task

```js
// File main.ako
@hello("World")


// File hello.ako
param = args[0]
@print("Hello {param} !")
```

## Recursive task
A task can call itself, you need to be careful to not create an infinite loop.

In the following example, we will see a countdown example, where the countdown function call itself with a different value
```js
// File main.ako
@print("Let's get started")
@countdown(15)

// File countdown.ako
param = args[0]
if param <= 0 {
    @print("Finish !!!")
    return
}
@print("${param} !")
@sleep(1)
@countdown(param - 1)
```

## Private Task
Task can be stored directly in a file, the task will be registered only when the script run for the first time, and can be called only from inside this file.

```js
task hello {
    param = args[0]
    @print("Hello {param} !")
}

@hello("World")
```
