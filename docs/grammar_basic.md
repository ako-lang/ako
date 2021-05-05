# How AKO works?

The key element of **Ako** is to represent algorithm as a succession of separated Commands

And there is only a really limited set of possible Commands. The more commons are:
* Assign an expression result to a variable with: `=`
* Conditional with: `If`
* Loop with: `For`
* Execute a task with: `@`

### Sample (fibonachi sequence)

```js
// We create a task to compute fibo
task fibo {
    if args[0] <= 0 { return 0 }
    elif args[0] == 1 { return 1 }

    prev1 = @fibo(args[0] - 1)
    prev2 = @fibo(args[0] - 2)
    return prev1 + prev2
}

// We call our task and print the result
fibo15 = @fibo(15)
@print("Fibo(15) = {fibo15}")
```

# Basic Types

### Variable

```js
// Create simple variables
num = 2
float = 2.5
str = "tuna"
bool = true
```

### Math Operation
both integer and float are supported with most usual math operation
```js
a = 1 + 2
a = 1 * 2
a = 1 / 2
a = 1 - 2
a = 1 % 2

a = ((1+3) * Math.abs(4) - 2) + -1
```

### String
both single and double quote string are supported (they are identical)
```js
a = "abc"
a = 'abc'
```
and by default, all string are interpolated.
If a variable doesnt exist, it will be simply ignored
```js
fish1 = "tuna"
fish2 = "salmon"

@print("there is 3 fishes around {fish1}, {fish2} and {fish3}")
// there is 3 fishes around tuna, salmon and {fish3}
```

### Collections
```js
// Create list
list = [1, 2, 3, 4]

// Create dictionary
pos = { x = 1, y = 2, z = 3 }
```
