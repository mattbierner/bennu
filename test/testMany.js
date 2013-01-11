define(['parse/parse', 'parse/parse_eager'], function(parse, parse_eager){
    var ab = parse_eager.many(parse.either(
            parse.character('a'),
            parse.character('b')));
    
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
                 var pairs = parse_eager.many(parse.either(
                         parse.character('ab'),
                         parse.character('cd')));
                 
                  assert.deepEqual(parse.run(pairs, ['ab', 'cd', 'ab', 'ca']), ['ab', 'cd', 'ab']);
              }],
              ["Consume large input many",
              function(){
                  var a = parse_eager.many(parse.character('a'));
                  
                  var input = (new Array(1000 + 1)).join('a');
                  
                  var result = parse.run(a, input);
                  assert.deepEqual(result.length, 1000);
              }],
              ["Consume infinite throws",
               function(){
                   assert.throws(parse.run.bind(undefined,
                       parse.many(parse.always('z')), "abbaab"));
               }],
              
        ],
    };
});
