# Loop

In Ako there is only one loop `For` but with 3 different behaviours:

## Iterate List
To iterate a list of elements, the syntax is `for [val] in [list] [block]`
```js
for a in [1,2,3,4,5,6,7,8] {
  @print("{a}")
}
```
you can also have the iteration index
```js
for val, index in [1,2,3,4,5,6,7,8] {
  @print("{index} = {val}")
}
```

## Until condition
This is commonly named `until` or `while` loop in other language.

The syntax is `for [condition] [block]`
```js
for counter < 10 {
  counter += 1
}
```

## Infinite Loop
This is an infinite loop, make sure to put some

The syntax is `for [block]`
```js
for {
  counter += 1
}
```
