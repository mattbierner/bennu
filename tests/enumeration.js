var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.siple = function(test) {
    var a = parse.eager(parse.enumeration(parse_text.character('a'), parse_text.character('b')));
    
    test.deepEqual(parse.run(a, "ab"), ['a', 'b']);

    test.done();
};

exports.failingSequence = function(test) {
    test.throws(parse.run.bind(undefined,
        parse.eager(parse.enumeration(parse_text.character('a'), parse.fail(), parse_text.character('b')), "ab")));
    
    test.throws(parse.run.bind(undefined,
        parse.eager(parse.enumeration(parse_text.character('a'), parse_text.character('b'), parse.fail()), "ab")));
    
    test.throws(parse.run.bind(undefined,
        parse.eager(parse.enumeration(parse.fail(), parse_text.character('a'), parse_text.character('b')), "ab")));
    
    test.done();
};
