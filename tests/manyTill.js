var parse = require('../index').parse;
var parse_text = require('../index').text;


var ab = parse.eager(
    parse.manyTill(
        parse_text.character('a'),
        parse_text.character('b')
    )
);

exports.manyItems = function(test) {

    test.deepEqual(parse.run(ab, "aaaba"), ['a', 'a', 'a']);

    test.done();
};

exports.noItems = function(test) {

    test.deepEqual(parse.run(ab, "xb"), []);

    test.deepEqual(parse.run(ab, "b"), []);

    test.deepEqual(parse.run(ab, "cd"), []);

    test.deepEqual(parse.run(ab, ""), []);

    test.done();
};

exports.noEnd = function(test) {

    test.deepEqual(parse.run(ab, "a"), ['a']);

    test.deepEqual(parse.run(ab, "aaa"), ['a', 'a', 'a']);

    test.done();
};

exports.large = function(test) {

    var input = (new Array(1000 + 1)).join('a') + 'b';

    var result = parse.run(ab, input);

    test.deepEqual(result.length, 1000);

    test.done();
};

exports.endRulesOverP = function(test) {

    var ab = parse.eager(
        parse.manyTill(
            parse_text.character('b'),
            parse_text.character('b')
        )
    );

    test.deepEqual(parse.run(ab, "bb"), []);

    test.done();
};

exports.anyToken = function(test) {

    var ab = parse.eager(
        parse.manyTill(
            parse.anyToken,
            parse_text.character('!')
        )
    );

    test.deepEqual(parse.run(ab, "ab!"), ['a', 'b']);

    test.done();
};
