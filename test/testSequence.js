define(['parse/parse', 'parse/parse_eager'], function(parse, parse_eager){
    return {
        'module': "Sequence Tests",
        'tests': [
            ["Simple Sequence",
            function(){
                var a = parse_eager.sequence(parse.character('a'), parse.character('b'));
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
             }],
        ],
    };
});
