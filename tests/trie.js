var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.unique = function(test) {
    var p = parse_text.trie(['abc', 'xyz', 'def']);
    
    test.deepEqual(parse.run(p, "abc"), 'abc');
    test.deepEqual(parse.run(p, "abcd"), 'abc');
    test.throws(parse.run.bind(undefined, p, "ab"));
    
    test.deepEqual(parse.run(p, "def"), 'def');
    
    test.done();
};

exports.longest = function(test) {
    var p = parse_text.trie(['a', 'ab', 'abc']);
    
    test.deepEqual(parse.run(p, "a"), 'a');
    test.deepEqual(parse.run(p, "abc"), 'abc');
    test.deepEqual(parse.run(p, "abz"), 'ab');
    test.throws(parse.run.bind(undefined, p, "f"));
    
    test.done();
};

exports.longestBacktracking = function(test) {
    var p = parse_text.trie(['a', 'abcd', 'abcz']);
    
    test.deepEqual(parse.run(p, "a"), 'a');
    test.deepEqual(parse.run(p, "abc"), 'a');
    test.deepEqual(parse.run(p, "abcy"), 'a');
    
    test.done();
};

exports.noMatchDoesNotConsume = function(test) {
    var p = parse_text.trie(['abcd', 'abcz']);
    
    test.deepEqual(parse.run(p, "abcd"), 'abcd');
    test.deepEqual(parse.run(p, "abcz"), 'abcz');
    test.deepEqual(parse.run(parse.either(p, parse.always('none')), "a"), 'none');
    test.deepEqual(parse.run(parse.next(
        parse.optional(null, p),
        parse_text.string('xyz')), "xyz"), 'xyz');
    
    test.done();
}