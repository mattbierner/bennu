define(['parse/parse', 'parse/string'], function(parse, parse_string){
    return {
        'module': "parse.enumeration",
        'tests': [
            ["Simple Sequence",
            function(){
                var a = parse.eager(parse.enumeration(parse_string.character('a'), parse_string.character('b')));
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
             }],
             
            ["fail Sequence",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse_string.character('a'), parse.fail(), parse_string.character('b')), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse_string.character('a'), parse_string.character('b'), parse.fail()), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse.fail(), parse_string.character('a'), parse_string.character('b')), "ab")));
             }]
        ],
    };
});
