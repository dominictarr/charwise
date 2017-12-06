var number = require('./codec/number.js');
var forward = {}
var reverse = {}
var negative = new Array(32)

for(var i = 0; i < 32; i++) {
  forward[i.toString(32)] = i
  negative[i] = (32-i).toString(32)
  reverse[i.toString(32)] = 32-i
}

var flip = exports.flip = function (n) {
  var s = n.toString()
  var f = ''
  for(var i in s) {
    f += s[i] == '.' ? '.' : (9 - +s[i])
  }
  return f
}

function round (n) {
  return n < 0 ? Math.ceil(n) : Math.floor(n)
}

function fraction (f) {
  return f - round(f)
}

exports.number = number;

exports.string = {
  encode: function (s) {
    //we'll need to escape the separators
    if(!/\x00|\x01/.test(s))
      return 'S'+s
    else {
      return 'S'+s.replace(/\x01/g, '\x01\x01').replace(/\x00/g, '\x01')
    }
  },
  decode: function (s) {
    if('S' === s[0])
      return s.substring(1) //TODO, unescape things...
  }
}

exports.object = {
  encode: function (a) {
    if(!a) return 'A'
    if(!Array.isArray(a)) throw new Error('can only encode arrays')
    var s = ''
    for(var i = 0; i < a.length; i++)
      s += '!'+exports.encode(a[i])
    return s
  },
  decode: function (s) {
    if(s === 'A') return null
    return s.split('!').slice(1).map(exports.decode)
  }
}

exports.boolean = {
  encode: function (b) {
    return b ? 'C' : 'B'
  },
  decode: function (b) {
    return 'C' === b
  }
}

exports.undefined = {
  encode: function (b) {
    return 'U'
  },
  decode: function () {
    return undefined
  }
}

exports.encode = function (t) {
  return exports[typeof t].encode(t)
}

var decoders = {
  A: exports.object.decode, //null
  B: exports.boolean.decode,
  C: exports.boolean.decode,
  P: exports.number.decode,
  N: exports.number.decode,
  S: exports.string.decode,
  O: exports.object.decode,
  U: exports.undefined.decode,
  '!': exports.object.decode,
}

exports.decode = function (s) {
  if(s === '') return s

  if(!decoders[s[0]])
    throw new Error('no decoder for:'+JSON.stringify(s))
  return decoders[s[0]](s)
}

//for leveldb, request strings
exports.buffer = false
exports.type = 'charwise'
