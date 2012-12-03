define(['parse'], function(parse){
    return {
        'module': "Choice Tests",
        'tests': [
            ["Succeed Choice",
            function(){
                var a = parse.choice(
                    parse.character('a'),
                    parse.character('b'),
                    parse.character('c'));
                
                assert.deepEqual(parse.run(a, "abc"), 'a');
                
                assert.deepEqual(parse.run(a, "bac"), 'b');
                
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
                    parse.character('a'),
                    parse.character('b'),
                    parse.character('c'));
                
                assert.throws(parse.run.bind(undefined, a, "z"));
                
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Choice Order",
             function(){
                var a = parse.choice(
                    parse.string('a'),
                    parse.string('aa'),
                    parse.string('aaa'));
                assert.deepEqual(parse.run(a, "aaaa"), 'a');
                
                assert.deepEqual(parse.run(parse.choice(
                    parse.string('aaa'),
                    parse.string('aa'),
                    parse.string('a')), 'aaaa'), 'aaa');
            }]
        ],
    };
});
