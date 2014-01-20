var parse = require('../index').parse;
var parse_text = require('../index').text;

var a = parse_text.character('a'),
    b = parse_text.character('b');
    
   
exports.success = function(test) {
    var result = parse.run(
        parse.attempt(parse.always(3)),
        "abc"
    );
    test.deepEqual(result, 3);
    
    test.done();
};

exports.failIsNever = function(test) {
     test.throws(parse.run.bind(undefined,
         parse.attempt(parse.fail()),
         "abc"
     ));
     var result = parse.run(
         parse.either(
             parse.attempt(parse.next(parse_text.character('a'),
                 parse_text.character('b'))),
             parse.next(parse_text.character('a'),
                 parse_text.character('c'))
         ),
         'ac'
    );
    test.deepEqual(result, 'c');
    
    test.done();
};

exports.backtrackConsumeThenFail = function(test) {
    var p = parse.either(
            parse.attempt(parse.sequence(a, parse.bind(parse.anyToken, function() { return parse.never(); }))),
            parse.sequence(a, b));
    
    test.deepEqual(
        parse.run(p, 'ab'),
        'b');
    
    test.done();
};
