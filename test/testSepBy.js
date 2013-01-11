define(['parse/parse', 'parse/parse_eager'], function(parse, parse_eager){
    return {
        'module': "SepBy Tests",
        'tests': [
            ["Simple sepBy",
            function(){
                var a = parse_eager.sepBy(parse.character(','), parse.character('a'));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
            }],
        ],
    };
});
