# Expression

Expression are a major part of **Ako**, the can be see as Excel formula.
It can be:
* scalar (string, boolean, number, array, ...)
* variable
* mathematic operation
* function call

but it can also be a mix of those and contain parentheses `Math.abs(-2+1) * 2`

## Math Expression
```js
num = 2 + 1
float = num * 1.5
```

List of mathematical support
* `*` : Multiply
* `/` : Divide
* `+` : Add
* `-` : Substract
* `%` : Modulo

## Expression using function
```js
num = Math.max(2 + 1, 2 * 2)
```

## Expression Pipe
Expression can become quite long and hard to read, the Pipe operator is there to help chaining function call. It take the result of an expr and pass it to another one

```js
a = List.sort(List.map(List.filter([1,2,4,5,6], (val) => val < 5), (val) => 10 / val))

// can be rewritten into
a = [1,2,4,5,6]
  |> List.filter($, (val) => val < 5)
  |> List.map($, (val) => 10 / val)
  |> List.sort($)
```

# Equality Expression
```js
a = true
b = a * 2 >= 12
```

List of mathematical support
* `==` : Equal
* `!=` : Different
* `<` : Less than
* `<=` : Less or equal than
* `>` : More than
* `>=` : More or equal than

And they can be combined logic operator
* `and`
* `or`
