define(['parse/parse', 'parse/parse_lang'], function(parse, parse_lang){
    return {
        'module': "SepBy Tests",
        'tests': [
            ["Simple sepBy",
            function(){
                var a = parse.eager(parse_lang.sepBy(parse.character(','), parse.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.deepEqual(parse.run(a, ""), []);
            }],
            ["No backtracking",
            function(){
                var a = parse.eager(parse_lang.sepBy(parse.character(','), parse.character('a')));
                
                assert.throws(parse.run.bind(undefined, a, "a,a,z"), parse.UnexpectError);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            
            ["Simple sepBy1",
            function(){
                var a = parse.eager(parse_lang.sepBy1(parse.character(','), parse.character('a')));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ""));
            }],
        ],
    };
});
