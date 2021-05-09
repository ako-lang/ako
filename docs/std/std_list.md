# List

## Functions
* `List.filter(list, lambda) => list`
* `List.map(list, lambda) => list`
* `List.sort(list, lambda) => list`
* `List.reverse(list) => list`
* `List.append(list, val) => list`
* `List.prepend(list, val) => list`
* `List.contains(list, val) => boolean`
* `List.concat(list1, list2) => list`
* `List.join(list, sep) => string`
* `len(list) => number`

### Sample

```js
a = [1,2,3,4,5]
b = List.filter(a, (val) => val < 4) // b = [1,2,3]
b = List.map(a, (val) => val * 2) // b = [2,4,6,8,10]
b = List.sort(a, (val1, val2) => val2 - val1) // [5,4,3,2,1]
b = List.reverse(a) // [5,4,3,2,1]
b = List.append(a, 42) // [5,4,3,2,1,42]
b = List.prepend(a, 42) // [42,5,4,3,2,1]
b = List.contains(a, 2) // true
b = List.concat(a, [1,2,3]) // [1,2,3,4,5,1,2,3]
b = List.join(a, '-') // 1-2-3-4-5
```
