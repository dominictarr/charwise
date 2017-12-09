exports.factory = function (codec) {
    return {
        encode: function (array) {
            if (array === null) { return 'A'; }
            if (!Array.isArray(array)) { throw new Error('can only encode arrays'); }
            return 'K' + array.map(function (item) {
                return escape(codec.encode(item))
            }).join('!');
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
