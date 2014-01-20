var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;


exports.simple = function (test) {
    var a = parse.eager(parse_lang.times(3, parse_text.character('a')));

    test.deepEqual(parse.run(a, "aaa"), ['a', 'a', 'a']);

    test.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a']);
    
    test.done();
};

exports.zero = function (test) {
    var a = parse.eager(parse_lang.times(0, parse_text.character('a')));

    test.deepEqual(parse.run(a, "aaa"), []);

    test.deepEqual(parse.run(a, ""), []);
    
    test.done();
};

exports.tooFew = function (test) {
    var a = parse.eager(parse_lang.times(3, parse_text.character('a')));

    test.throws(parse.run.bind(undefined, a, "aa"));
    test.throws(parse.run.bind(undefined, a, ""));
    
    test.done();
};

exports.largeInput = function (test) {
    var a = parse.eager(parse_lang.times(1000, parse_text.character('a')));

    var input = (new Array(2000 + 1)).join('a');

    var result = parse.run(a, input);
    test.deepEqual(result.length, 1000);
    
    test.done();
};