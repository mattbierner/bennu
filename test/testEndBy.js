define(['parse/parse', 'parse/text', 'parse/lang'], function(parse, parse_text, parse_lang){
    return {
        'module': "EndBy",
        'tests': [
            ["Simple endBy",
            function(){
                var a = parse.eager(parse_lang.endBy(parse_text.character(','), parse_text.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            ["Simple endBy1",
            function(){
                var a = parse.eager(parse_lang.endBy1(parse_text.character(','), parse_text.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a,"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ","));
            }],
        ],
    };
});
