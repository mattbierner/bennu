define(['parse'], function(parse){
    return {
        'module': "Lookahead Tests",
        'tests': [
            ["Success",
            function(){
                assert.deepEqual(parse.run(
                    parse.lookahead(parse.char('a')),
                    "a"),
                'a');
                
                assert.deepEqual(parse.run(
                    parse.next(
                        parse.lookahead(parse.char('a')),
                        parse.char('a')),
                    "a"),
                'a');
                
            }],
            ["Fails",
            function(){
                assert.throws(parse.run.bind(undefined,
                    parse.lookahead(parse.char('a')),
                    "")
                );
            }],
        ],
    };
});
