var parse = require('../index').parse;


exports.empty_input = function(test) {
    test.deepEqual(
        parse.run(parse.eof, ""),
        null);

    test.done();
};


exports.failing_input = function(test) {
    test.throws(
        parse.run.bind(null, parse.eof, "a"),
        null);

    test.done();
};
