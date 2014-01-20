var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.p = function(test) {
    var result = parse.run(
        parse.either(
            parse.always(3),
            parse.always(5)),
        "abc");
    test.deepEqual(result, 3);
    
    test.done();
};

exports.q = function(test) {
    var result = parse.run(
        parse.either(
            parse.never(),
            parse.always(5)),
        "abc"
    );
    test.deepEqual(result, 5);
    
    test.done();
};

exports.bothFail = function(test) {
     test.throws(parse.run.bind(undefined,
         parse.either(
             parse.never(),
             parse.never()),
         "abc"
             ));
     
     test.done();
};
