define(['parse/parse'], function(parse){
    return {
        'module': "Sequence Tests",
        'tests': [
            ["Simple Sequence",
            function(){
                var a = parse.eager(parse.sequence(parse.character('a'), parse.character('b')));
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
             }],
             
            ["fail Sequence",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.sequence(parse.character('a'), parse.fail(), parse.character('b')), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.sequence(parse.character('a'), parse.character('b'), parse.fail()), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.sequence(parse.fail(), parse.character('a'), parse.character('b')), "ab")));
             }]
        ],
    };
});
