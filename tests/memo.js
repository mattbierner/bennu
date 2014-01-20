var parse = require('../index').parse;
var parse_text = require('../index').text;
var stream = require('nu-stream').stream;


exports.simple = function(test) {
    var g = 0;
    
    var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
        g++;
        return parse.always(x);
    }));
    
    parse.run(
        parse.either(
            parse.attempt(parse.sequence(a, a, parse.never())),
            parse.sequence(a, a, a)),
        "aaa");
    
    test.deepEqual(g, 3);
    
    test.done();
};

exports.parser = function(test) {
    var g = 0;
    
    var a = parse.Parser('a', parse.bind(parse_text.character('a'), function(x) {
        g++;
        return parse.always(x);
    }));
    
    parse.run(
        parse.either(
            parse.attempt(parse.sequence(parse.memo(a), parse.memo(a), parse.never())),
            parse.sequence(parse.memo(a), parse.memo(a), parse.memo(a))),
        "aaa");
    
    test.deepEqual(g, 3);
    
    test.done();
};

exports.nested = function(test) {
    var g = 0;
    
    var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
        g++;
        return parse.always(x);
    }));
    
    parse.run(
        parse.either(
            parse.attempt(parse.either(
                parse.attempt(parse.sequence(a, parse.never())),
                parse.sequence(a, a, parse.never()))),
            parse.sequence(a, a, a)),
        "aaa");
    
    test.deepEqual(g, 3);
    
    test.done();
};

exports.changeStream = function(test) {
    var ga = 0, gb = 0;
    
    var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
        ga++;
        return parse.always(x);
    }));
    
     var b = parse.memo(parse.bind(parse_text.character('b'), function(x) {
        gb++;
        return parse.always(x);
    }));
     
    parse.run(
        parse.sequence(
            a,
            a,
            parse.setInput(stream.from('abb')),
            parse.setPosition(new parse.Position(0)),
            a,
            b,
            b),
        "aaa");
    
    test.deepEqual(ga, 3);
    test.deepEqual(gb, 2);
    
    test.done();
};
