var parse = require('../index').parse;
var parse_text = require('../index').text;

var a = parse_text.character('a'),
    b = parse_text.character('b'),
    any = parse.anyToken;

exports.success = function(test) {
    test.deepEqual(parse.run(
        parse.next(
            parse.not(a),
            parse.anyToken),
        "b"),
    'b');
    
    test.deepEqual(parse.run(
        parse.next(
            parse.not(a),
            parse.eof),
        ""),
    null);
    test.done();
};

exports.fails = function(test) {
    test.throws(parse.run.bind(undefined,
        parse.not(parse_text.character('a')),
        "a"));
    
    test.done();
};

exports.backtrackConsumeThenFail = function(test) {
    var p = parse.sequence(
        parse.not(parse.sequence(a, b)),
        parse.not(parse.sequence(a, a)),
        parse.sequence(any, any));
    
    test.throws(
        parse.run.bind(null, p, 'ab'));
    
    test.throws(
        parse.run.bind(null, p, 'aa'));
    
    test.equal(
        parse.run(p, 'ba'),
        'a');
    
    
    test.done();
};
