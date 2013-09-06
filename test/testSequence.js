define(['parse/parse', 'parse/text'], function(parse, parse_text){
    return {
        'module': "Sequence Tests",
        'tests': [
            ["Simple Sequence",
            function(){
                var a = parse.sequence(parse_text.character('a'), parse_text.character('b'));
                
                assert.deepEqual(parse.run(a, "ab"), 'b');
             }],
             
            ["fail Sequence",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.sequence(parse_text.character('a'), parse.fail(), parse_text.character('b')), "ab"));
                
                assert.throws(parse.run.bind(undefined,
                    parse.sequence(parse_text.character('a'), parse_text.character('b'), parse.fail()), "ab"));
                
                assert.throws(parse.run.bind(undefined,
                    parse.sequence(parse.fail(), parse_text.character('a'), parse_text.character('b')), "ab"));
             }]
        ],
    };
});
