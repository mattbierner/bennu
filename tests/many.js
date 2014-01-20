var parse = require('../index').parse;
var parse_text = require('../index').text;


var ab = parse.eager(parse.many(parse.either(
    parse_text.character('a'),
    parse_text.character('b'))));


exports.manyItems = function(test) {
    test.deepEqual(parse.run(ab, "abbaab"), ['a', 'b', 'b', 'a', 'a', 'b']);
    
    test.deepEqual(parse.run(ab, "abbaab abba"), ['a', 'b', 'b', 'a', 'a', 'b']);

    test.done();
};

exports.noItems = function(test) {
    test.deepEqual(parse.run(ab, "cd"), []);
    
    test.deepEqual(parse.run(ab, ""), []);

    test.done();
};

exports.nonString = function(test) {
     var pairs = parse.eager(parse.many(parse.either(
         parse_text.character('ab'),
         parse_text.character('cd'))));
     
    test.deepEqual(parse.run(pairs, ['ab', 'cd', 'ab', 'ca']), ['ab', 'cd', 'ab']);
    test.done();
};

exports.large = function(test) {
    var a = parse.eager(parse.many(parse_text.character('a')));
    
    var input = (new Array(1000 + 1)).join('a');
    
    var result = parse.run(a, input);
    test.deepEqual(result.length, 1000);
    
    test.done();
};

exports.infiniteThrows = function(test) {
    test.throws(parse.run.bind(undefined,
        parse.many(parse.always('z')), "abbaab"));
    
    test.done();
};
