define(['parse/parse', 'parse/parse_eager'], function(parse, parse_eager){
    return {
        'module': "SepBy Tests",
        'tests': [
            ["Simple sepBy",
            function(){
                var a = parse_eager.sepBy(parse.character(','), parse.character('a'));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.deepEqual(parse.run(a, ""), []);
            }],
            ["No backtracking",
            function(){
                var a = parse_eager.sepBy(parse.character(','), parse.character('a'));
                
                assert.throws(parse.run.bind(undefined, a, "a,a,z"), parse.UnexpectError);
                
                assert.deepEqual(parse.run(a, ","), []);
            }],
            
            ["Simple sepBy1",
            function(){
                var a = parse_eager.sepBy1(parse.character(','), parse.character('a'));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.throws(parse.run.bind(undefined, a, ""));
            }],
        ],
    };
});
