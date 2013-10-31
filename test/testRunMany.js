define(['parse/parse',
        'parse/text',
        'parse/incremental',
        'nu/stream'],
function(parse,
        parse_text,
        incremental,
        stream){
    var ab = parse.either(
            parse_text.character('a'),
            parse_text.character('b'));
    
    return {
        'module': "Run Many Tests",
        'tests': [
            ["Consume many items",
            function(){
                assert.deepEqual(
                    stream.toArray(incremental.runMany(ab, "abbaab")),
                    ['a', 'b', 'b', 'a', 'a', 'b']);
                
                assert.deepEqual(
                    stream.toArray(incremental.runMany(ab, "abbaab abba")),
                    ['a', 'b', 'b', 'a', 'a', 'b']);
            }],
            ["Consume no items, return empty stream",
            function(){                
                assert.deepEqual(
                    stream.toArray(incremental.runMany(ab, "cd")),
                    []);
                
                assert.deepEqual(
                    stream.toArray(incremental.runMany(ab, "")),
                    []);
             }],
              ["Run on infinite stream",
              function(){
                  var s = stream.stream('a', function(){ return s; });
                  
                  var result = incremental.runManyStream(parse_text.character('a'), s);
                  assert.ok(true);
              }]
        ],
    };
});
