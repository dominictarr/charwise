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
                if (char === '!') {
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
    var l = string.length;
    var buffer = '';
    for (var i = 0; i < l; i++) {
        if (string[i] === '!') {
            buffer += '??';
        } else if (string[i] === '?') {
            buffer += '?@';
        } else {
            buffer += string[i];
        }
    }
    return buffer;
}

function unescape (string) {
    var l = string.length;
    var buffer = '';
    for (var i = 0; i < l; i++) {
        if (string[i] === '?' && string[i+1] === '?') {
            buffer += '!';
            i++;
        } else if (string[i] === '?' && string[i+1] === '@') {
            buffer += '?';
            i++;
        } else {
            buffer += string[i];
        }
    }
    return buffer;
}
