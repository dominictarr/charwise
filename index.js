
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
    return s.replace('\x00', '\x01\x01')
  },
  decode: function () {
    throw new Error('charwise.string.decode: not yet implemented')
  }
}

exports.encode = function (ary) {
  var s = ''
  for(var i = 0; i < ary.length; i++)
    s += '!'+exports[typeof ary[i]].encode(ary[i])
  return s
}

