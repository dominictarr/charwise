// Number is encoded in scientific notation.
// A Number is composed of an exponent and a mantissa. The exponent isan integer
// in [-324, 308] and the mantissa is a decimal in ]-10, 10[.
// First we encode the sign as N or P, then E marking the start of the exponent.
// The exponent is offseted of 500 to be positive and startpadded to 3 chars.
// We endpad mantissa with enough zero to exceed mantissa precision.
// Then negative numbers' mantissa and exponent are flipped (nines' complement)

exports.encode = function (number) {
    if (isNaN(number)) { return "NaN"; }
    if (number === 0) { return "PE  0M0"; }
    if (number === Infinity) { return "PF"; }
    if (number === -Infinity) { return "ND"; }

    var splitScientificNotation = number.toExponential().split('e');
    var exponent = Number(splitScientificNotation[1]) + 500;
    var mantissa = splitScientificNotation[0] + (splitScientificNotation[0].indexOf('.') === -1 ? '.' : '') + '0'.repeat(20);
    var encoded = 'E' + padStart(String(exponent), 3) + 'M' + String(mantissa);
    if (number > 0) {
        return 'P' + encoded;
    } else {
        return 'N' + flip(encoded);
    }
}

exports.decode = function (encoded) {
    if (encoded === 'NaN') { return NaN; }
    if (encoded === 'PF') { return Infinity; }
    if (encoded === 'ND') { return -Infinity; }

    var isNegative = encoded[0] === 'N';
    var splitEncoded = (isNegative ? flip(encoded) : encoded).slice(2).split('M');
    return Number((isNegative ? '-':'') + splitEncoded[1] + 'e' + String(Number(splitEncoded[0])-500));
}

function flip(number) {
    var flipped = '';
    for (var i = 0; i < number.length; i++) {
        var digit = number[i];
        if (isNaN(Number(digit)) || digit === ' ') {
            if (digit !== '-') { flipped += digit; }
        } else {
            flipped += String(9 - Number(digit));
        }
    }
    return flipped;
}

function padStart (str, count) {
  return (' ').repeat(count - str.length).substr(0,count) + str;
};
