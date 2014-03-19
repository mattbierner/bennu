var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;
var incremental = require('../index').incremental

var stream = require('nu-stream').stream;
var ab = parse.either(
    parse_text.character('a'),
    parse_text.character('b'));


exports.consumeMany = function (test) {
    test.deepEqual(
        stream.toArray(
            incremental.runMany(ab, "abbaab")),
        ['a', 'b', 'b', 'a', 'a', 'b']);

    test.deepEqual(
        stream.toArray(
            incremental.runMany(ab, "abbaabXabba")),
        ['a', 'b', 'b', 'a', 'a', 'b']);
    
    test.done();
};
exports.consumeNone = function (test) {
    test.deepEqual(
        stream.toArray(incremental.runMany(ab, "cd")), []);

    test.deepEqual(
        stream.toArray(incremental.runMany(ab, "")), []);

    test.done();
};

exports.infiniteSource = function (test) {
    var s = stream.stream('a', function () {
        return s;
    });

    var result = incremental.runManyStream(parse_text.character('a'), s);
    test.ok(true);
    test.done();
};