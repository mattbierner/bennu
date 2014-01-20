var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;


exports.endBy = function(test) {
    var a = parse.eager(parse_lang.endBy(parse_text.character(','), parse_text.character('a')));
    
    test.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
    
    test.deepEqual(parse.run(a, "a,"), ['a']);
    
    test.deepEqual(parse.run(a, ","), []);

    test.done();
};

exports.endBy1 = function(test) {
    var a = parse.eager(parse_lang.endBy1(parse_text.character(','), parse_text.character('a')));
    
    test.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
    
    test.deepEqual(parse.run(a, "a,"), ['a']);
    
    test.throws(parse.run.bind(undefined, a, ","));

    test.done();
};

