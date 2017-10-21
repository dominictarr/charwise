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
    f += (9 - +s[i])
  }
  return f
}


exports.number = {
  encode: function (n) {
    var s = (n>=0?n:n*-1).toString()
    var l = s.length.toString()
    if(n >= 0)
      return 'P'+l+s
    else
      return 'N'+flip(l)+flip(s)
  },
  decode: function (s) {
    if(s[0] === 'P') return parseInt(s.substring(2))
    if(s[0] === 'N') return -flip(s.substring(2))
  }
}

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
    return s.split('\x00').map(exports.decode)
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

}

exports.decode = function (s) {
  return decoders[s[0]](s)
}

