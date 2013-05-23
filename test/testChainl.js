define(['parse/parse', 'parse/parse_lang', 'parse/parse_string'], function(parse, parse_lang, parse_string){
    var add = parse.next(parse.character('+'), parse.always(function(x, y){ return x + y; }));
    var mul = parse.next(parse.character('*'), parse.always(function(x, y){ return x * y; }));
    var op = parse.either(add, mul);
    
    var num = parse.bind(parse_string.digit, function(x){ return parse.always(parseInt(x)); });
    
    return {
        'module': "Chainl Tests",
        'tests': [
            ["Simple chainl1",
            function(){
                var a = parse_lang.chainl1(op, num);
                assert.deepEqual(parse.run(a, "1"), 1);
                assert.deepEqual(parse.run(a, "1+2"), 3);
                assert.deepEqual(parse.run(a, "1*2+3"), 5);
                assert.deepEqual(parse.run(a, "1+2*3"), 9);
                assert.deepEqual(parse.run(a, "1+2+3*6*2+4"), 76);
            }],
            ["Simple chainl",
            function(){
                var a = parse_lang.chainl(op, 0, num);
                assert.deepEqual(parse.run(a, ""), 0);
                assert.deepEqual(parse.run(a, "y"), 0);
                assert.deepEqual(parse.run(a, "1"), 1);
                assert.deepEqual(parse.run(a, "1+2"), 3);
                assert.deepEqual(parse.run(a, "1*2+3"), 5);
                assert.deepEqual(parse.run(a, "1+2*3"), 9);
                assert.deepEqual(parse.run(a, "1+2+3*6*2+4"), 76);
            }],
        ],
    };
});
