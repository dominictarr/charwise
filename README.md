# charwise

like bytewise, except as strings.

codec for js values (including arrays) that preserves lexiographic
sort order when encoded. (the order is compatible with [bytewise](https://github.com/deanlandolt/bytewise) and thus indexeddb and couchdb,
but the encoded format is different)

The api provided follows [the level codec standard](https://github.com/level/codec#encoding-format)
so this encoding can easily be used with [level](https://github.com/level)
and [flumedb](https://github.com/flumedb)

## motivation

for building indexes on top of leveldb, bytewise is great!
it lets you structure you keys and reason about how they
will be ordered in a very simple and reliable way.

But bytewise is too slow! it's slow enough to have quite visible
effects on a bulk load on a reasonable sized database with a couple
of indexes.
(i.e. 100k [secure-scuttlebutt](https://github.com/ssbc/secure-scuttlebutt) messages with indexes, measured by [bench-ssb](https://github.com/ssbc/bench-ssb))

## stability: experimental

Expect breaking changes to encoded format. We are still making
breaking changes if necessary to improve performance.

(although, [codec api](https://github.com/level/codec#encoding-format) is fully stable and will not change)

## simple benchmark

run a simple benchmark for one second, encoding & decoding ops
in one second.

```
# name, ops, multiplier
bytewise encode 35661
charwise encode 131366 x3.6
bytewise decode 107571
charwise decode 144557 x1.3
```

It was easy to make charwise faster than bytewise when
it was only a partial implementation, but once correct escaping
and nested arrays where added it got slow.

But then [@PaulBlanche](https://github.com/PaulBlanche)
[had the genious idea](https://github.com/dominictarr/charwise/pull/7)
of encoding items in an array with their depth inside the array.
This supports deeply nested arrays or shallowly nested arrays
with only one pass escaping the items. This made encoding much faster
again!

## Examples

```js
const level = require('level')
const charwise = require('charwise')

const db = level('./db8', {
  keyEncoding: charwise
})

await db.batch([
  { type: 'put', key: ['users', 2], value: 'example' },
  { type: 'put', key: ['users', 10], value: 'example2' }
])

const userStream = db.createStream({
  gte: ['users', charwise.LO],
  lte: ['users', charwise.HI]
})

// This will print ['users', 2], ['users', 10]
// If you dont use charwise its sorted numerically and would
// print ['users', 10] , ['users', 2]
userStream.on('data', console.log)
```


## License

MIT




