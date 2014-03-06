var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.simple = function(test) {
    var p = parse_text.oneOf('abc');
    
    test.deepEqual(
        parse.run(p, 'a'),
        'a');
    
    test.deepEqual(
        parse.run(p, 'b'),
        'b');
    
    test.deepEqual(
        parse.run(p, 'c'),
        'c');
    
    test.throws(
        parse.run.bind(null, p, 'd'));
    
    test.throws(
        parse.run.bind(null, p, ''));
    
    test.done();
};


exports.empty = function(test) {
    var p = parse.either(parse_text.oneOf(''), parse.always("XX"))
    
    test.deepEqual(
        parse.run(p, ''),
        'XX');
    
    test.deepEqual(
        parse.run(p, ' '),
        'XX');
    
    test.deepEqual(
        parse.run(p, 'a'),
        'XX');

    test.done();
};
