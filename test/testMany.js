define(['parse'], function(parse){
    var ab = parse.many(parse.either(
            parse.char('a'),
            parse.char('b')));
    
    return {
        'module': "Many Tests",
        'tests': [
            ["Consume many items",
            function(){
                assert.deepEqual(parse.run(ab, "abbaab"), ['a', 'b', 'b', 'a', 'a', 'b']);
                
                assert.deepEqual(parse.run(ab, "abbaab abba"), ['a', 'b', 'b', 'a', 'a', 'b']);
            }],
            ["Consume no items, return empty array",
            function(){                
                assert.deepEqual(parse.run(ab, "cd"), []);
                
                assert.deepEqual(parse.run(ab, ""), []);
             }],
             
             ["Consume non string",
             function(){
                 var pairs = parse.many(parse.either(
                         parse.char('ab'),
                         parse.char('cd')));
                 
                  assert.deepEqual(parse.run(pairs, ['ab', 'cd', 'ab', 'ca']), ['ab', 'cd', 'ab']);
              }],
           
        ],
    };
});
