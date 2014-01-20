var parse = require('../index').parse;
var parse_text = require('../index').text;


exports.success = function(test) {
    test.deepEqual(parse.run(
        parse.lookahead(parse_text.character('a')),
        "a"),
    'a');
    
    test.deepEqual(parse.run(
        parse.next(
            parse.lookahead(parse_text.character('a')),
            parse_text.character('a')),
        "a"),
    'a');
    test.done();
};

exports.fails = function(test) {
    test.throws(parse.run.bind(undefined,
        parse.lookahead(parse_text.character('a')),
        ""));
    
    test.done();
};

exports.mergeState = function(test) {
    test.deepEqual(parse.run(
        parse.next(
            parse.lookahead(
                parse.next(
                    parse_text.character('a'),
                    parse.setState(3))),
            parse.getState),
        "a"),
    3);
    test.done();
};

exports.oldPositionRestored = function(test) {
    test.deepEqual(parse.run(
        parse.next(
            parse.lookahead(parse_text.character('a')),
            parse.bind(parse.getPosition, function(x) { return parse.always(x.index);})),
        "a"),
    0);

    test.done();
};
