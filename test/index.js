

var tape = require('tape')

var codec = require('../')

tape('numbers', function (t) {

  var expected = [1,2,0,-1, 10, 1000, 949939434, -2, -30]

  function test (n) {
    var s = codec.number.encode(n)
    t.equal(typeof s, 'string')
    t.equal(codec.number.decode(s), n)
    return s
  }

  var actual = expected.map(test)

  expected.sort(function (a, b) { return a - b })
  console.log(expected)
  actual.sort() //default to sort as strings
  console.log(actual)
  t.deepEqual(actual.map(codec.number.decode), expected)
  t.end()

})

function cmp (a, b) {
  return a - b
}
//
//function neg (e) { 
//  return -e
//}

tape('flip', function (t) {
  var ns = [1,2,3,4,13,34,35, 50,100]
  console.log(ns.map(codec.flip))
  console.log(ns.map(codec.flip).map(codec.flip).map(Number))
  t.deepEqual(ns.map(codec.flip).map(codec.flip).map(Number), ns)
//  t.deepEqual(
//    ns.map(codec.flip).sort().map(codec.flip).map(Number),
//    ns.map(neg).sort(cmp).map(neg)
//  )
  t.end()
})

