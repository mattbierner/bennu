define(['parse'], function(parse){
    return {
        'module': "Lookahead Tests",
        'tests': [
            ["Success",
            function(){
                assert.deepEqual(parse.run(
                    parse.lookahead(parse.character('a')),
                    "a"),
                'a');
                
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(parse.character('a')),
                        parse.character('a')),
                    "a"),
                'a');
                
            }],
            ["Fails",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.lookahead(parse.character('a')),
                    "")
                );
            }],
        ],
    };
});
