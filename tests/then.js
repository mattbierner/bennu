var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;


exports.simple = function(test) {
    var a = parse_lang.then(parse_text.character('a'), parse_text.character('b'));
    
    test.deepEqual(parse.run(a, "ab"), 'a');
    
    test.deepEqual(
        parse.run(parse.next(a, parse_text.character('c')), "abc"),
        'c');
    
    test.done();
};

exports.pFails = function(test) {
    var a = parse.either(
        parse_lang.then(
            parse.never(),
            parse_text.character('b')),
        parse_text.character('a'));
    
    test.deepEqual(parse.run(a, "ab"), 'a');

    test.done();
};

exports.qFails = function(test) {
    var a = parse.either(
        parse.attempt(parse_lang.then(
            parse_text.character('a'),
            parse.never('b'))),
        parse_text.character('a'));
    
    test.deepEqual(parse.run(a, "ab"), 'a');

    test.done();
};
