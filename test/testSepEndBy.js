define(['parse/parse', 'parse/string', 'parse/lang'], function(parse, parse_string, parse_lang){
    var sep = parse_string.character(',');
    var p = parse_string.character('a');
    var z = parse_string.character('z');
    
    return {
        'module': "SepEndBy",
        'tests': [
            ["No End",
            function(){
                var a = parse.eager(parse_lang.sepEndBy(sep, p));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                assert.deepEqual(parse.run(parse.next(a, z), "a,az"), 'z');
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                assert.deepEqual(parse.run(parse.next(a, z), "az"), 'z');
                
                assert.deepEqual(parse.run(a, ""), []);
                assert.deepEqual(parse.run(parse.next(a, z), "z"), 'z');
            }],
            ["End",
            function(){
                var a = parse.eager(parse_lang.sepEndBy(sep, p));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                assert.deepEqual(parse.run(parse.next(a, z), "a,a,z"), 'z');
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                assert.deepEqual(parse.run(parse.next(a, z), "a,z"), 'z');
                
                assert.deepEqual(parse.run(a, ","), []);
                assert.deepEqual(parse.run(parse.next(a, z), ",z"), 'z');
                
                assert.deepEqual(parse.run(parse.next(a, sep), ",,"), ',');
            }],
            ["sepBy1 No End",
            function(){
                var a = parse.eager(parse_lang.sepEndBy1(sep, p));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ""));
            }],
            ["sepBy1 End",
            function(){
                var a = parse.eager(parse_lang.sepEndBy1(sep, p));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                assert.deepEqual(parse.run(parse.next(a, z), "a,a,z"), 'z');
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                assert.deepEqual(parse.run(parse.next(a, z), "a,z"), 'z');
                
                assert.throws(parse.run.bind(undefined, a, ","));
            }],
        ],
    };
});
