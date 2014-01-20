var parse = require('../index').parse;
var parse_text = require('../index').text;
var parse_lang = require('../index').lang;


var sep = parse_text.character(',');
var p = parse_text.character('a');
var z = parse_text.character('z');


exports.noEnd = function(test) {
    var a = parse.eager(parse_lang.sepEndBy(sep, p));
    
    test.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
    test.deepEqual(parse.run(parse.next(a, z), "a,az"), 'z');
    
    test.deepEqual(parse.run(a, "a"), ['a']);
    test.deepEqual(parse.run(parse.next(a, z), "az"), 'z');
    
    test.deepEqual(parse.run(a, ""), []);
    test.deepEqual(parse.run(parse.next(a, z), "z"), 'z');
    
    test.done();
};

exports.end = function(test) {
    var a = parse.eager(parse_lang.sepEndBy(sep, p));
    
    test.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
    test.deepEqual(parse.run(parse.next(a, z), "a,a,z"), 'z');
    
    test.deepEqual(parse.run(a, "a,"), ['a']);
    test.deepEqual(parse.run(parse.next(a, z), "a,z"), 'z');
    
    test.deepEqual(parse.run(a, ","), []);
    test.deepEqual(parse.run(parse.next(a, z), ",z"), 'z');
    
    test.deepEqual(parse.run(parse.next(a, sep), ",,"), ',');
    
    test.done();
};

exports.sepBy1NoEnd = function(test) {
    var a = parse.eager(parse_lang.sepEndBy1(sep, p));
    
    test.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
    
    test.deepEqual(parse.run(a, "a"), ['a']);
    
    test.throws(parse.run.bind(undefined, a, ""));
    
    test.done();
};


exports.sepBy1End = function(test) {
    var a = parse.eager(parse_lang.sepEndBy1(sep, p));
    
    test.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
    test.deepEqual(parse.run(parse.next(a, z), "a,a,z"), 'z');
    
    test.deepEqual(parse.run(a, "a,"), ['a']);
    test.deepEqual(parse.run(parse.next(a, z), "a,z"), 'z');
    
    test.throws(parse.run.bind(undefined, a, ","));
    
    test.done();
};
