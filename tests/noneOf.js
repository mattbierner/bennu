var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.simple = function(test) {
    var p = parse_text.noneOf('abc');
    
    test.deepEqual(
        parse.run(p, 'd'),
        'd');
    
    test.deepEqual(
        parse.run(p, 'z'),
        'z');
    
    test.throws(
        parse.run.bind(null, p, 'a'));
    
    test.throws(
        parse.run.bind(null, p, 'c'));
    
    test.done();
};


exports.empty = function(test) {
    var p = parse_text.noneOf('');
    
    test.deepEqual(
        parse.run(p, 'a'),
        'a');
    
    test.deepEqual(
        parse.run(p, 'b'),
        'b');
    
    test.done();
};
