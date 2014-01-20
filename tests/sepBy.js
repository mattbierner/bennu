var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;


exports.sepBy = function(test) {
    var a = parse.eager(parse_lang.sepBy(parse_text.character(','), parse_text.character('a')));
    
    test.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
    
    test.deepEqual(parse.run(a, "a"), ['a']);
    
    test.deepEqual(parse.run(a, ""), []);
    
    test.done();
};

exports.noBacktracking = function(test) {
    var a = parse.eager(parse_lang.sepBy(parse_text.character(','), parse_text.character('a')));
    
    test.throws(parse.run.bind(undefined, a, "a,a,z"), parse.ExpectError);
    
    test.deepEqual(parse.run(a, ","), []);

    test.done();
};

exports.sepBy1 = function(test) {
    var a = parse.eager(parse_lang.sepBy1(parse_text.character(','), parse_text.character('a')));
    
    test.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
    
    test.deepEqual(parse.run(a, "a"), ['a']);
    
    test.throws(parse.run.bind(undefined, a, ""));

    test.done();
};
