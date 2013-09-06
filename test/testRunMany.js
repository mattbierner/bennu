define(['parse/parse', 'parse/text', 'nu/stream'], function(parse, parse_text, stream){
    var ab = parse.either(
            parse_text.character('a'),
            parse_text.character('b'));
    
    return {
        'module': "Run Many Tests",
        'tests': [
            ["Consume many items",
            function(){
                assert.deepEqual(
                    stream.toArray(parse.runMany(ab, "abbaab")),
                    ['a', 'b', 'b', 'a', 'a', 'b']);
                
                assert.deepEqual(
                    stream.toArray(parse.runMany(ab, "abbaab abba")),
                    ['a', 'b', 'b', 'a', 'a', 'b']);
            }],
            ["Consume no items, return empty stream",
            function(){                
                assert.deepEqual(
                    stream.toArray(parse.runMany(ab, "cd")),
                    []);
                
                assert.deepEqual(
                    stream.toArray(parse.runMany(ab, "")),
                    []);
             }],
              ["Run on infinite stream",
              function(){
                  var s = stream.stream('a', function(){ return s; });
                  
                  var result = parse.runManyStream(parse_text.character('a'), s);
                  assert.ok(true);
              }]
        ],
    };
});
