var parse = require('../index').parse;


exports.simple = function(test) {
    var result = parse.run(
        parse.next(
            parse.always(3),
            parse.always(5)),
        "");
    test.deepEqual(result, 5);

    test.done();
};
