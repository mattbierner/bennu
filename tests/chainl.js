var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;

var add = parse.next(parse_text.character('+'), parse.always(function(x, y){ return x + y; }));
var mul = parse.next(parse_text.character('*'), parse.always(function(x, y){ return x * y; }));
var op = parse.either(add, mul);

var num = parse.bind(parse_text.digit, function(x){ return parse.always(parseInt(x)); });
    

exports.chainl1 = function(test) {
    var a = parse_lang.chainl1(op, num);
    
    test.deepEqual(parse.run(a, "1"), 1);
    test.deepEqual(parse.run(a, "1+2"), 3);
    test.deepEqual(parse.run(a, "1*2+3"), 5);
    test.deepEqual(parse.run(a, "1+2*3"), 9);
    test.deepEqual(parse.run(a, "1+2+3*6*2+4"), 76);
    
    test.done();
};

exports.chainl = function(test) {
    var a = parse_lang.chainl(op, 0, num);
    
    test.deepEqual(parse.run(a, ""), 0);
    test.deepEqual(parse.run(a, "y"), 0);
    test.deepEqual(parse.run(a, "1"), 1);
    test.deepEqual(parse.run(a, "1+2"), 3);
    test.deepEqual(parse.run(a, "1*2+3"), 5);
    test.deepEqual(parse.run(a, "1+2*3"), 9);
    test.deepEqual(parse.run(a, "1+2+3*6*2+4"), 76);
    
    test.done();
};
