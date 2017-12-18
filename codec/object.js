exports.factory = function (codec) {
    return {
        encode: function (array) {
            if (array === null) { return 'A'; }
            if (!Array.isArray(array)) { throw new Error('can only encode arrays'); }
            if(array.length == 0) return 'K'
            var s = 'K'+escape(codec.encode(array[0]))
            var l = array.length
            for(var i = 1; i < l; i++)
              s += '!' + escape(codec.encode(array[i]))
            return s
        },
        decode: function (encoded) {
            if (encoded === 'A') { return null; }
            if (encoded === 'K') { return []; }
            var buffer = "";
            var array = [];
            for (var i = 1; i < encoded.length; i++) {
                var char = encoded[i];
                if (char === '!' && encoded[i-1] !== '\\') {
                    array.push(codec.decode(unescape(buffer)))
                    buffer = '';
                } else {
                    buffer += char;
                }
            }
            array.push(codec.decode(unescape(buffer)))
            return array;
        }
    }
}

function escape (string) {
    return string.replace(/!/g, '\\!')
}

function unescape (string) {
    return string.replace(/\\!/g, '!')
}


