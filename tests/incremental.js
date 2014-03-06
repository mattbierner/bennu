var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;
var incremental = require('../index').incremental

var stream = require('nu-stream').stream;
var gen = require('nu-stream').gen;

var a = parse_text.character('a'),
    b = parse_text.character('b');

var ab = parse.either(
    a,
    b);


exports.simple = function (test) {
    var p = incremental.runInc(ab);
    
    test.equal(
        incremental.finish(incremental.provideString('a', p)),
        'a');
    
    test.equal(
        incremental.finish(incremental.provideString('b', p)),
        'b');

    test.done();
};

exports.empty = function (test) {
    var p = incremental.runInc(
        parse.sequence(
            parse.always('1'),
            parse.always('2'),
            parse.always('3'),
            parse.always('4')));

    test.deepEqual(incremental.finish(p), '4');

    test.done();
};

exports.multiple = function (test) {
    var p = incremental.runInc(parse.eager(parse.many(ab)));
    
    test.deepEqual(
        incremental.finish(incremental.provideString('a', p)),
        ['a']);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('b', p)),
        ['b']);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('abba', p)),
        ['a', 'b', 'b', 'a']);
    
    test.deepEqual(incremental.finish(incremental.provideString('babab', p)),
        ['b', 'a', 'b', 'a', 'b']);

    test.done();
};

exports.multipleProvides = function (test) {
    var p = incremental.runInc(parse.eager(parse.many(ab)));
    var r = incremental.provideString('a', p);
    
    
    test.deepEqual(
        incremental.finish(incremental.provideString('a', r)),
        ['a', 'a']);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('b', r)),
        ['a', 'b']);
    test.done();
};

exports.providesTooMuch = function (test) {
    var p = incremental.runInc(parse.eager(parse.enumeration(a, a, a)));
    var r = incremental.provideString('aaaaaa', p);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('a', r)),
        ['a', 'a', 'a']);
    
    test.done();
};

exports.providesEmpty = function (test) {
    var p = incremental.runInc(parse.eager(parse.enumeration(a, a, a)));
    var r = incremental.provideString('aa', p);
    var r1 = incremental.provideString('', r);
    var r2 = incremental.provideString('', r1);

    test.deepEqual(
        incremental.finish(incremental.provideString('a', r2)),
        ['a', 'a', 'a']);

    test.done();
};


exports.simpleBacktracking = function (test) {
    var p = incremental.runInc(
        parse.either(
            parse.attempt(parse.sequence(a, a, a)),
            parse.sequence(a, a, b)));
    
    test.deepEqual(
        incremental.finish(incremental.provideString('aaa', p)),
        'a');
    
    test.deepEqual(
        incremental.finish(incremental.provideString('aab', p)),
        'b');

    test.done();
};

exports.backtrackingHalfProvided = function (test) {
    var p = incremental.runInc(
        parse.either(
            parse.attempt(parse.sequence(a, a, a)),
            parse.sequence(a, a, b)));
    
    var r = incremental.provideString('aa', p);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('a', r)),
        'a');
    test.deepEqual(
        incremental.finish(incremental.provideString('b', r)),
        'b');

    test.done();
};


exports.backtrackingMultiProvides = function (test) {
    var p = incremental.runInc(
        parse.either(
            parse.attempt(parse.sequence(a, a, a)),
            parse.sequence(a, a, b)));
    var r = incremental.provideString('a', p);
    var r2 = incremental.provideString('a', r);

    test.deepEqual(
        incremental.finish(incremental.provideString('a', r2)),
        'a');
    
    test.deepEqual(
        incremental.finish(incremental.provideString('b', r2)),
        'b');

    test.done();
};

exports.backtrackingEof = function (test) {
    var p = incremental.runInc(
        parse.either(
            parse.attempt(parse.sequence(a, a, parse.eof)),
            parse.sequence(a, a, b)));
    var r = incremental.provideString('a', p);
    var r2 = incremental.provideString('a', r);

    test.deepEqual(
        incremental.finish(r2),
        null);
    
    test.deepEqual(
        incremental.finish(incremental.provideString('b', r2)),
        'b');
    
    test.done();
};
exports.backtrackingConsumesThenFails = function (test) {
    var p = incremental.runInc(
        parse.choice(
            parse.attempt(parse.sequence(a, a, parse.bind(a, function () {
                return parse.never('');
            }))),
            parse.attempt(parse.sequence(a, a, parse.bind(a, function () {
                return parse.never('');
            }))),
            parse.sequence(a, a, parse.anyToken)));
    var r = incremental.provideString('aa', p);

    test.deepEqual(
        incremental.finish(incremental.provideString('a', r)),
        'a');
    test.done();
};

exports.eof = function (test) {
    var p = incremental.runInc(
        parse_lang.then(
            parse.eager(parse.enumeration(a, a, a)),
            parse.eof));

    test.deepEqual(
        incremental.finish(incremental.provideString('aaa', p)),
        ['a', 'a', 'a']);
    
    test.done();
};

exports.notEof = function (test) {
    var p = incremental.runInc(
        parse_lang.then(
            parse.eager(parse.enumeration(a, a)),
            parse.eof));

    test.throws(function () {
        incremental.finish(incremental.provideString('aaa', p));
    });
    test.done();
};

exports.multiFeedDoesNotTrifferEof = function (test) {
    var p = incremental.runInc(
        parse_lang.then(
            parse.eager(parse.enumeration(a, a, a)),
            parse.eof));

    var r = incremental.provideString('a', p);
    var r1 = incremental.provideString('a', r);
    var r2 = incremental.provideString('a', r1);

    test.deepEqual(
        incremental.finish(r2),
        ['a', 'a', 'a']);

    test.done();
};


exports.multiFeedDoesNotTriggerEofWithFailure = function (test) {
    var p = incremental.runInc(
        parse_lang.then(
            parse.eager(parse.enumeration(a, a)),
            parse.eof));

    var r = incremental.provideString('a', p);
    var r1 = incremental.provideString('a', r);
    var r2 = incremental.provideString('a', r1);

    test.throws(function () {
        incremental.finish(r2);
    });
    test.done();
};


exports.infSource = function (test) {
    var p = incremental.runInc(
        parse.eager(parse_lang.times(3, a)));

    test.deepEqual(
        incremental.finish(incremental.provide(gen.repeat(Infinity, 'a'), p)),
        ['a', 'a', 'a']);

    test.done();
};


exports.startingInput = function (test) {
    var p = incremental.runIncState(
        parse.eager(parse.enumeration(a, a, b, a)),
        new parse.ParserState(
            stream.from('aa'),
            parse.Position.initial,
            null));

    var r = incremental.provideString('b', p);
    var r2 = incremental.provideString('a', r);
    test.deepEqual(
        incremental.finish(r2),
        ['a', 'a', 'b', 'a']);

    test.done();
};