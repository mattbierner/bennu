define(['parse'], function(parse){
    return {
        'module': "SepBy Tests",
        'tests': [
            ["Simple sepBy",
            function(){
                var a = parse.sepBy(parse.character(','), parse.character('a'));
                
                assert.deepEqual(parse.run(a, "a,a"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
            }],
        ],
    };
});
