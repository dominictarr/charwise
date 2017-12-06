var tape = require('tape')
const { encode, decode } = require('../codec/number.js');

const rand = (min, max) => Math.random() * (max - min) + min

const randQ1 = () => {
    const dice = Math.floor(rand(0, 3));
    if (dice === 0) {
        return (1+Math.random()) * Math.pow(10, rand(0,9))
    }
    if (dice === 1) {
        return (1+Math.random()) * Math.pow(10, rand(10,99))
    }
    if (dice === 2) {
        return (1+Math.random()) * Math.pow(10, rand(100,300))
    }
}

const randQ2 = () => {
    const dice = Math.floor(rand(0, 3));
    if (dice === 0) {
        return Math.random() * Math.pow(10, -rand(0,9))
    }
    if (dice === 1) {
        return Math.random() * Math.pow(10, -rand(10,99))
    }
    if (dice === 2) {
        return Math.random() * Math.pow(10, -rand(100,300))
    }
}

const randQ3 = () => -randQ2();

const randQ4 = () => -randQ1();

const randQ = () => {
    const dice = Math.floor(rand(0, 4));
    if (dice === 0) { return randQ1(); }
    if (dice === 1) { return randQ2(); }
    if (dice === 2) { return randQ3(); }
    if (dice === 3) { return randQ4(); }
}
tape("Number: 1", t => {
    t.equals(decode(encode(1)), 1, 'decode inverses encode');
    t.assert(encode(1) > encode(0.999), 'orders well with number before')
    t.assert(encode(1) < encode(1.001), 'orders well with number after')
    t.end();
});

tape("Number: -1", t => {
    t.equals(decode(encode(-1)), -1, 'decode inverses encode');
    t.assert(encode(-1) > encode(-1.001), 'orders well with number before')
    t.assert(encode(-1) < encode(-0.999), 'orders well with number after')
    t.end();
});

tape("Number: 0", t => {
    t.equals(decode(encode(0)), 0, 'decode inverses encode');
    t.assert(encode(0) > encode(-Number.MIN_VALUE), 'orders well with number before')
    t.assert(encode(0) < encode(Number.MIN_VALUE), 'orders well with number after')
    t.end();
});

tape("Number: Infinity", t => {
    t.equals(decode(encode(Infinity)), Infinity, 'decode inverses encode');
    t.assert(encode(Infinity) > encode(Number.MAX_VALUE), 'orders well with number before')
    t.end();
});

tape("Number: Infinity", t => {
    t.equals(decode(encode(-Infinity)), -Infinity, 'decode inverses encode');
    t.assert(encode(-Infinity) < encode(Number.MAX_VALUE), 'orders well with number after')
    t.end();
});

tape("Number: random pairs", t => {
    let i;
    for (i = 0; i < 1000; i++) {
        const a = randQ();
        const b = randQ();
        if (decode(encode(a)) !== a) {
            t.equals(decode(encode(a)), a, `decode(encode(${a})) !== ${a}`);
            break;
        }
        if (decode(encode(b)) !== b) {
            t.equals(decode(encode(b)), b, `decode(encode(${b})) !== ${b}`);
            break;
        }
        if(a < b && encode(a) >= encode(b)) {
            t.fail(`encode(${a}) >= encode(${b})`);
            break;
        }
        if(a > b && encode(a) <= encode(b)) {
            t.fail(false, `encode(${a}) <= encode(${b})`);
            break;
        }
        if(a === b && encode(a) !== encode(b)) {
            t.fail(false, `encode(${a}) !== encode(${b})`);
            break;
        }
    }
    if (i === 1000) {
        t.pass('All random pairs validated')
    }
    t.end();
});

tape("Number: random pairs of close numbers", t => {
    let i;
    for (i = 0; i < 100; i++) {
        const a = Math.floor(rand(-10,10));
        const b = a + (Math.random() > 0.5 ? 1 : -1)*0.000000000000001;
        if (decode(encode(a)) !== a) {
            t.equals(decode(encode(a)), a, `decode(encode(${a})) !== ${a}`);
            break;
        }
        if (decode(encode(b)) !== b) {
            t.equals(decode(encode(b)), b, `decode(encode(${a})) !== ${a}`);
            break;
        }
        if(a < b && encode(a) >= encode(b)) {
            t.fail(`encode(${a}) >= encode(${b})`);
            break;
        }
        if(a > b && encode(a) <= encode(b)) {
            t.fail(`encode(${a}) <= encode(${b})`);
            break;
        }
        if(a === b && encode(a) !== encode(b)) {
            t.fail(`encode(${a}) !== encode(${b})`);
            break;
        }
    }
    if (i === 100) {
        t.pass('All random pairs validated')
    }
    t.end();
});
