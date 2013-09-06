define(['parse/parse', 'parse/string', 'parse/lang'], function(parse, parse_string, parse_lang){
    return {
        'module': "EndBy",
        'tests': [
            ["Simple endBy",
            function(){
                var a = parse.eager(parse_lang.endBy(parse_string.character(','), parse_string.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            ["Simple endBy1",
            function(){
                var a = parse.eager(parse_lang.endBy1(parse_string.character(','), parse_string.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ","));
            }],
        ],
    };
});
