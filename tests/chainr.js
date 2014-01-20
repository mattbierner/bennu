var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;

var add = parse.next(parse_text.character('+'), parse.always(function(x, y){ return x + y; }));
var mul = parse.next(parse_text.character('*'), parse.always(function(x, y){ return x * y; }));
var op = parse.either(add, mul);

var num = parse.bind(parse_text.digit, function(x){ return parse.always(parseInt(x)); });

exports.chainr1 = function(test) {
    var a = parse_lang.chainr1(op, num);
    
    test.deepEqual(parse.run(a, "1"), 1);
    test.deepEqual(parse.run(a, "1+2"), 3);
    test.deepEqual(parse.run(a, "1+2*3"), 7);
    test.deepEqual(parse.run(a, "1*2+3"), 5);
    
    test.done();
};

exports.chainr = function(test) {
    var a = parse_lang.chainr(op, 30, num);
    
    test.deepEqual(parse.run(a, ""), 30);
    test.deepEqual(parse.run(a, "+"), 30);
    test.deepEqual(parse.run(a, "1"), 1);
    test.deepEqual(parse.run(a, "1+2"), 3);
    test.deepEqual(parse.run(a, "1+2*3"), 7);
    test.deepEqual(parse.run(a, "1*2+3"), 5);
    
    test.done();
};
