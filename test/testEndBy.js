define(['parse/parse', 'parse/parse_lang'], function(parse, parse_lang){
    return {
        'module': "EndBy",
        'tests': [
            ["Simple endBy",
            function(){
                var a = parse.eager(parse_lang.endBy(parse.character(','), parse.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            ["Simple endBy1",
            function(){
                var a = parse.eager(parse_lang.endBy1(parse.character(','), parse.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ","));
            }],
        ],
    };
});
