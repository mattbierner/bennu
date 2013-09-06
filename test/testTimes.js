define(['parse/parse', 'parse/string', 'parse/lang'], function(parse, parse_string, parse_lang){
    
    return {
        'module': "Times Tests",
        'tests': [
            ["Consume Times items",
            function(){
                var a = parse.eager(parse_lang.times(3, parse_string.character('a')));
                
                assert.deepEqual(parse.run(a, "aaa"), ['a', 'a', 'a']);
                
                assert.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a']);
            }],
            ["Consume Zero items",
             function(){
                 var a = parse.eager(parse_lang.times(0, parse_string.character('a')));
                 
                 assert.deepEqual(parse.run(a, "aaa"), []);
                 
                 assert.deepEqual(parse.run(a, ""), []);
            }],
            ["Consume Too few",
            function(){
                var a = parse.eager(parse_lang.times(3, parse_string.character('a')));

                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Consume non string",
             function(){
                 var abPairs = parse.eager(parse_lang.times(3, parse_string.character('ab')));
                 
                  assert.deepEqual(parse.run(abPairs, ['ab', 'ab', 'ab', 'ca']), ['ab', 'ab', 'ab']);
              }],
              
              ["Consume large input many",
               function(){
                   var a = parse.eager(parse_lang.times(1000, parse_string.character('a')));
                   
                   var input = (new Array(2000 + 1)).join('a');
                   
                   var result = parse.run(a, input);
                   assert.deepEqual(result.length, 1000);
               }],
        ],
    };
});
