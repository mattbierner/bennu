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
            ["sepBy trailing sep",
            function(){
                var a = parse_eager.sepBy(parse.character(','), parse.character('a'));
                
                assert.deepEqual(parse.run(a, "a,a,"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, ","), []);
                
                assert.deepEqual(parse.run(parse.next(a, parse.character(',')) , "a,a,"), ',');
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
