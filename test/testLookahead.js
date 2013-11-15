define(['parse/parse',
        'parse/text'],
function(parse,
        parse_text){
    
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
            ["merges state",
            function(){
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(
                            parse.next(
                                parse_text.character('a'),
                                parse.setState(3))),
                        parse.getState),
                    "a"),
                3);
            }],
            ["Old position restored",
            function(){
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(parse_text.character('a')),
                        parse.bind(parse.getPosition, function(x) { return parse.always(x.index);})),
                    "a"),
                0);
            }],
        ],
    };
});
