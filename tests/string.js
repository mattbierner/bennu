var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.simple = function(test) {
    test.deepEqual(parse.run(parse_text.string('abc'), 'abc'), 'abc');
    test.deepEqual(parse.run(parse_text.string('abc'), 'abcd'), 'abc');
    test.deepEqual(parse.run(parse.next(parse_text.string('abc'), parse_text.anyChar), 'abcd'), 'd');

    test.throws(parse.run.bind(undefined, parse_text.string('abc'), 'ab'), parse.ExpectError);
    test.throws(parse.run.bind(undefined, parse_text.string('abc'), ''), parse.ExpectError);
    test.throws(parse.run.bind(undefined, parse_text.string('abc'), 'abx'), parse.ExpectError);
    
    test.done();
};

exports.stringObjects = function(test) {
    test.deepEqual(parse.run(parse_text.string('abc'), new String('abc')), 'abc');
    test.deepEqual(parse.run(parse_text.string(new String('abc')), 'abc'), 'abc');
    test.deepEqual(parse.run(parse_text.string(new String('abc')), new String('abc')), 'abc');
    
    test.done();
};

exports.failureConsumesNothing = function(test) {
    var abcOrX = parse.choice(
        parse_text.string('abc'),
        parse_text.character('x'));
    var abcOrA = parse.choice(
        parse_text.string('abc'),
        parse_text.character('a'));
    
    test.deepEqual(parse.run(abcOrX, 'abc'), 'abc');
    test.deepEqual(parse.run(abcOrX, 'x'), 'x');
    test.deepEqual(parse.run(parse.next(abcOrA, parse_text.anyChar), 'ab'), 'b');
    
    test.done();
};
