define(['parse'], function(parse){
    var ab = parse.many1(parse.either(
            parse.char('a'),
            parse.char('b')));
    
    return {
        'module': "Many1 Tests",
        'tests': [
            ["Consume many items",
            function(){
                assert.deepEqual(parse.run(ab, "a"), ['a']);
                
                assert.deepEqual(parse.run(ab, "abbaab"), ['a', 'b', 'b', 'a', 'a', 'b']);
                
                assert.deepEqual(parse.run(ab, "abbaab abba"), ['a', 'b', 'b', 'a', 'a', 'b']);
            }],
            ["Fail",
            function(){                
                assert.throws(parse.run.bind(undefined, ab, "cd"));
                
                assert.throws(parse.run.bind(undefined, ab, ""));
             }],
             
             ["Consume non string",
             function(){
                 var pairs = parse.many1(parse.either(
                     parse.char('ab'),
                     parse.char('cd')));
                 
                 assert.deepEqual(parse.run(pairs, ['ab', 'ef', 'ab', 'ca']), ['ab']);
                 
                  assert.deepEqual(parse.run(pairs, ['ab', 'cd', 'ab', 'ca']), ['ab', 'cd', 'ab']);
              }],
           
        ],
    };
});
