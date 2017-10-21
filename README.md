# charwise

like bytewise, except as strings.

A [standard codec](https://github.com/level/codec#encoding-format)
as used by [level](https://github.com/level) and [flumedb](https://github.com/flumedb)

## motivation

for building indexes on top of leveldb, bytewise is great!
it lets you structure you keys and reason about how they
will be ordered in a very simple and reliable way.

But bytewise is too slow! it's slow enough to have quite visible
effects on a bulk load on a reasonable sized database with a couple
of indexes.
(i.e. 100k [secure-scuttlebutt](https://github.com/ssbc/secure-scuttlebutt) messages with indexes, measured by [bench-ssb](https://github.com/ssbc/bench-ssb))


## simple benchmark

run a simple benchmark for one second, encoding & decoding ops
in one second.

```
# name, ops
bytewise.encode 24274
bytewise.decode 86983

charwise.encode 107742
charwise.decode 74076
```

`bytewise.encode` is too slow. It could probably be much faster.
`charwise` shows it can be much faster. I suspect the problem
is creating too many buffers.

## TODO

this is currently a crude proof of concept, not fully correct!

* nested arrays
* 1.01e12 style numbers
* escape weird values from strings

## License

MIT





