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

    let [mantissa, exponent] = number.toExponential().split('e');
    exponent = Number(exponent) + 500;
    mantissa += (mantissa.indexOf('.') === -1 ? '.' : '') + '0'.repeat(20);
    const encoded = `E${String(exponent).padStart(3)}M${String(mantissa)}`;
    if (number > 0) {
        return 'P' + encoded;
    }else{
        return 'N' + flip(encoded);
    }
}

exports.decode = function (encoded) {
    if (encoded === 'NaN') { return NaN; }
    if (encoded === 'PF') { return Infinity; }
    if (encoded === 'ND') { return -Infinity; }

    const isNegative = encoded[0] === 'N';
    let [exponent,mantissa] = (isNegative ? flip(encoded) : encoded).slice(2).split('M');
    return Number( `${isNegative ? '-':''}${mantissa}e${Number(exponent)-500}` );
}

function flip(number) {
    let flipped = '';
    for (let digit of number) {
        if (isNaN(Number(digit)) || digit === ' ') {
            if (digit !== '-') { flipped += digit; }
        } else {
            flipped += String(9 - Number(digit));
        }
    }
    return flipped;
}
