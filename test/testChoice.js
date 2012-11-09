define(['parse'], function(parse){
    return {
        'module': "Choice Tests",
        'tests': [
            ["Succeed Choice",
            function(){
                var a = parse.choice(
                    parse.char('a'),
                    parse.char('b'),
                    parse.char('c'));
                
                assert.deepEqual(parse.run(a, "abc"), 'a');
                
                assert.deepEqual(parse.run(a, "cab"), 'c');
            }],
            ["Zero Choice",
             function(){
                assert.throws(parse.run.bind(undefined, parse.choice(), "aa"));
                
                assert.throws(parse.run.bind(undefined, parse.choice(), ""));
            }],
            ["Failed Choices To few",
            function(){
                var a = parse.choice(
                    parse.char('a'),
                    parse.char('b'),
                    parse.char('c'));
                
                assert.throws(parse.run.bind(undefined, a, "z"));
                
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
        ],
    };
});
