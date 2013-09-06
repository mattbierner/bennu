define(['parse/parse', 'parse/text'], function(parse, parse_text){
    return {
        'module': "parse.enumeration",
        'tests': [
            ["Simple Sequence",
            function(){
                var a = parse.eager(parse.enumeration(parse_text.character('a'), parse_text.character('b')));
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
             }],
             
            ["fail Sequence",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse_text.character('a'), parse.fail(), parse_text.character('b')), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse_text.character('a'), parse_text.character('b'), parse.fail()), "ab")));
                
                assert.throws(parse.run.bind(undefined,
                    parse.eager(parse.enumeration(parse.fail(), parse_text.character('a'), parse_text.character('b')), "ab")));
             }]
        ],
    };
});
