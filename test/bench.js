var bytewise = require('bytewise')
var charwise = require('../')

var words = ['foo', 'bar','hello world', 'aosenthuaosnetuhaosnetu']

function bench (name, codec) {
  var start = Date.now(), c = 0
  while(Date.now() < start+1000) {
    c++
    codec.encode([
      words[~~(Math.random()*words.length)],
      ~~(Math.random()*1000),
      Math.random(),
      ~(Math.random()*10000),
      Date.now()
    ])
  }
  var time = (Date.now()-start)/1000
  console.log(name, c, c/time, time)
}


bench('bytewise', bytewise)
bench('charwise', charwise)




