define(['parse'], function(parse){

    
    return {
        'module': "Times Tests",
        'tests': [
            ["Consume Times items",
            function(){
                var a = parse.times(3, parse.char('a'));
                
                assert.deepEqual(parse.run(a, "aaa"), ['a', 'a', 'a']);
                
                assert.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a']);
            }],
            ["Consume Zero items",
             function(){
                 var a = parse.times(0, parse.char('a'));
                 
                 assert.deepEqual(parse.run(a, "aaa"), []);
                 
                 assert.deepEqual(parse.run(a, ""), []);
            }],
            ["Consume To few",
            function(){
                var a = parse.times(3, parse.char('a'));

                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             
             ["Consume non string",
             function(){
                 var abPairs = parse.times(3, parse.char('ab'));
                 
                  assert.deepEqual(parse.run(abPairs, ['ab', 'ab', 'ab', 'ca']), ['ab', 'ab', 'ab']);
              }],
           
        ],
    };
});