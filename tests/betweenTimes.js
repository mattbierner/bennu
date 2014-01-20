var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;

var ab = parse.either(
    parse_text.character('a'),
    parse_text.character('b'));

exports.greedyTimes = function(test) {
    var a = parse.eager(parse_lang.betweenTimes(1, 3, ab));
    
    test.deepEqual(parse.run(a, "ab"), ['a', 'b']);
    
    test.deepEqual(parse.run(a, "abc"), ['a', 'b']);
    
    test.deepEqual(parse.run(a, "aba"), ['a', 'b', 'a']);
    
    test.deepEqual(parse.run(a, "aaba"), ['a', 'a', 'b']);
    
    test.deepEqual(parse.run(a, "ababa"), ['a', 'b', 'a']);
    
    test.done();
};

exports.consumeZero = function(test) {
    var a = parse.eager(parse_lang.betweenTimes(0, 2, parse_text.character('a')));
     
     test.deepEqual(parse.run(a, "aaa"), ['a', 'a']);
     
     test.deepEqual(parse.run(a, ""), []);
     test.done();
};

exports.consumeUpperBoundInfinite = function(test) {
    var a = parse.eager(parse_lang.betweenTimes(2, Infinity, parse_text.character('a')));
     
     test.deepEqual(parse.run(a, "aa"), ['a', 'a']);
     
     test.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a', 'a', 'a']);
     test.done();
};

exports.tooFew = function(test) {
    var a = parse.eager(parse_lang.betweenTimes(3, 4, parse_text.character('a')));

    test.throws(parse.run.bind(undefined, a, "aa"), parse.ExpectError);
    test.throws(parse.run.bind(undefined, a, ""), parse.ExpectError);

    test.done();
};
 
 
exports.maxLtMin = function(test) {
    test.throws(function() { parse_lang.betweenTimes(5, 1, parse_text.character('a')); }, parse.ParserError);
    test.done();
};

exports.largeInput = function(test) {
    var a = parse.eager(parse_lang.betweenTimes(1000, 1500, parse_text.character('a')));
   
     var input = (new Array(2000 + 1)).join('a');
   
     var result = parse.run(a, input);
     test.deepEqual(result.length, 1500);
     test.done();
};
