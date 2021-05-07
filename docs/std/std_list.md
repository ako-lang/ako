# List

## Functions
* `List.filter(list, lambda)`
* `List.map(list, lambda)`
* `List.sort(list, lambda)`
* `List.reverse(list)`

## Sample

```js
a = [1,2,3,4,5]
b = List.filter(a, (val) => val < 4) // b = [1,2,3]
b = List.map(a, (val) => val * 2) // b = [2,4,6,8,10]
b = List.sort(a, (val1, val2) => val2 - val1) // [5,4,3,2,1]
b = List.reverse(a) // [5,4,3,2,1]
```
