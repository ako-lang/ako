# How AKO works?

The key element of **Ako** is to represent algorithm as a succession of separated Commands

And there is only a really limited set of possible Commands. The more commons are:
* Assign an expression result to a variable with: `=`
* Conditional with: `If`
* Loop with: `For`
* Execute a task with: `@`

## Design decision

For those reasons, **Ako** tries to stay simple
* Built around expressions (think about excel formula)
* Simple scope design, 1file = 1task = 1scope
* Sequential execution (no callback or async/await)
* No class or OOP (no `this`, `self` or `object` scope)
* Only one loop `For` (no while, foreach, ...)
* No switch, goto, try/catch, ...
* The code should be modular and easy to share and reuse

## Sample (fibonachi sequence)

```js
// We create a task to compute fibo
task fibo ["val"] {
    if val <= 0 { return 0 }
    elif val == 1 { return 1 }

    prev1 = @fibo(val - 1)
    prev2 = @fibo(val - 2)
    return prev1 + prev2
}

// We call our task and print the result
fibo15 = @fibo(15)
@print("Fibo(15) = {fibo15}")
```
