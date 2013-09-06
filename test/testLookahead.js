define(['parse/parse', 'parse/text'], function(parse, parse_text){
    return {
        'module': "Lookahead Tests",
        'tests': [
            ["Success",
            function(){
                assert.deepEqual(parse.run(
                    parse.lookahead(parse_text.character('a')),
                    "a"),
                'a');
                
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(parse_text.character('a')),
                        parse_text.character('a')),
                    "a"),
                'a');
                
            }],
            ["Fails",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.lookahead(parse_text.character('a')),
                    "")
                );
            }],
        ],
    };
});
