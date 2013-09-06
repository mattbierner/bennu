define(['parse/parse', 'parse/text', 'parse/lang'], function(parse, parse_text, parse_lang){
    return {
        'module': "parse_lang.sepBy",
        'tests': [
            ["Simple sepBy",
            function(){
                var a = parse.eager(parse_lang.sepBy(parse_text.character(','), parse_text.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.deepEqual(parse.run(a, ""), []);
            }],
            ["No backtracking",
            function(){
                var a = parse.eager(parse_lang.sepBy(parse_text.character(','), parse_text.character('a')));
                
                assert.throws(parse.run.bind(undefined, a, "a,a,z"), parse.ExpectError);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            
            ["Simple sepBy1",
            function(){
                var a = parse.eager(parse_lang.sepBy1(parse_text.character(','), parse_text.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ""));
            }],
        ],
    };
});
