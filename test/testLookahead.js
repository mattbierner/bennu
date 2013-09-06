define(['parse/parse', 'parse/string'], function(parse, parse_string){
    return {
        'module': "Lookahead Tests",
        'tests': [
            ["Success",
            function(){
                assert.deepEqual(parse.run(
                    parse.lookahead(parse_string.character('a')),
                    "a"),
                'a');
                
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(parse_string.character('a')),
                        parse_string.character('a')),
                    "a"),
                'a');
                
            }],
            ["Fails",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.lookahead(parse_string.character('a')),
                    "")
                );
            }],
        ],
    };
});
