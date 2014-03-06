var parse = require('../index').parse;


exports.simple = function(test) {
    test.deepEqual(
        parse.run(parse.always(5), "abc"),
        5);
    test.done();
};

exports.empty = function(test) {
    test.deepEqual(
        parse.run(parse.always(5), ""),
        5);
    
    test.done();
};



exports.simple_of = function(test) {
    test.deepEqual(
        parse.run(parse.Parser.of(5), "abc"),
        5);
    test.done();
};
