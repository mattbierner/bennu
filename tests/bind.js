var parse = require('../index').parse;

var identity = function(v) { return v; };
var constant = function(v) { return identity.bind(this, v); };

var add10 = function(x) { return parse.always(x + 10); };

exports.simple = function(test) {
    var result = parse.run(parse.bind(parse.always(3), function(x) {
        return parse.always(x + 5);
    }), "abc");
    test.deepEqual(result, 8);
    test.done();
};

exports.map = function(test) {
    var result = parse.run(parse.bind(parse.always(3), add10), "abc");
    test.deepEqual(result, 13);
    test.done();
};

exports.fail = function(test) {
    var result = parse.run(
        parse.either(
            parse.bind(parse.never(), constant(parse.always(5))),
            parse.always(10)), "abc");
    test.deepEqual(result, 10);
    test.done();
};


exports.chain = function(test) {
    test.deepEqual(
        parse.run(
            parse.always(3).chain(function(x) {
                return parse.always(x + 5);
            }),
            "abc"),
        8);
    
    test.done();
};

exports.multi_chain = function(test) {
    test.deepEqual(
        parse.run(
            parse.always(3)
                .chain(function(x) { return parse.always(x + 5);})
                .chain(function(x) { return parse.always(x / 2);}),
            "abc"),
        4);
    
    test.done();
};