var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.succeed = function(test) {
    var a = parse.choice(
        parse_text.character('a'),
        parse_text.character('b'),
        parse_text.character('c'));
    
    test.deepEqual(parse.run(a, "abc"), 'a');
    test.deepEqual(parse.run(a, "bac"), 'b');
    test.deepEqual(parse.run(a, "cab"), 'c');
    
    test.done();
};

exports.zeroChoiceFails = function(test) {
    test.throws(function() { parse.run(parse.choice(), "aa"); });
    test.done();
};

exports.allChoicesFail = function(test) {
    var a = parse.choice(
        parse_text.character('a'),
        parse_text.character('b'),
        parse_text.character('c'));
    
    test.throws(parse.run.bind(undefined, a, "z"));
    
    test.throws(parse.run.bind(undefined, a, ""));
    test.done();
};

exports.order = function(test) {
    var a = parse.choice(
        parse_text.string('a'),
        parse_text.string('aa'),
        parse_text.string('aaa'));
    test.deepEqual(parse.run(a, "aaaa"), 'a');
    
    test.deepEqual(parse.run(parse.choice(
        parse_text.string('aaa'),
        parse_text.string('aa'),
        parse_text.string('a')), 'aaaa'), 'aaa');

    test.done();
};