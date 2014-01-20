var parse = require('../index').parse;
var parse_text = require('../index').text;

var a = parse_text.character('a'),
    b = parse_text.character('b');


exports.simple = function(test) {
    var ab = parse.sequence(a, b);
    
    test.deepEqual(parse.run(ab, "ab"), 'b');
    test.done();
};

exports.failing = function(test) {
    test.throws(parse.run.bind(undefined,
        parse.sequence(a, parse.fail(), b), "ab"));
    
    test.throws(parse.run.bind(undefined,
        parse.sequence(a, b, parse.fail()), "ab"));
    
    test.throws(parse.run.bind(undefined,
        parse.sequence(parse.fail(), a, b), "ab"));
    
    test.done();
};
