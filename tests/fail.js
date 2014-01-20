var parse = require('../index').parse;


exports.simple = function(test) {
    test.throws(
        parse.run.bind(undefined, parse.fail(), "abc"),
        parse.UnknownError);
    test.throws(
        parse.run.bind(undefined, parse.fail(), ""),
        parse.UnknownError);

    test.done();
};

exports.withMessage = function(test) {
    test.throws(
        parse.run.bind(undefined, parse.fail("error"), ""),
        parse.ParseError);

    test.done();
};
