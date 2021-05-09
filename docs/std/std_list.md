# String

## Functions
* `String.capitalize(string) => string`
* `String.upper(string) => string`
* `String.lower(string) => string`
* `String.repeat(string, amount) => string`
* `String.startsWith(string, sub) => string`
* `String.endsWith(string, sub) => string`
* `String.trim(string) => string`
* `String.split(string, sep) => list`
* `String.replace(string, search, replacement) => string`

### Sample

```js
a = "bOb is a tuna "
b = String.capitalize(a) // b = 'BOb Is A Tuna '
b = String.upper(a) // b = 'BOB IS A TUNA '
b = String.lower(a) // b = 'bob is a tuna '
b = String.repeat(a, 3) // b = 'bOb is a tuna bOb is a tuna bOb is a tuna '
b = String.startsWith(a, 'bOb') // b = true
b = String.endsWith(a, 'tuna') // b = false
b = String.trim(a) // b = 'bOb is a tuna'
b = String.split(a, ' ') // b = ['bOb','is','a','tuna']
b = String.replace(a, 'tuna', 'bob') // b = 'bOb is a bob '
```
