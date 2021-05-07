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
