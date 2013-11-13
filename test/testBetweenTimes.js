define(['parse/parse', 'parse/text', 'parse/lang'],
function(parse, parse_text, parse_lang){
    var ab = parse.either(
        parse_text.character('a'),
        parse_text.character('b'));
    
    return {
        'module': "parse_lang.betweenTimes",
        'tests': [
            ["Greedy Consume Times items",
            function(){
                var a = parse.eager(parse_lang.betweenTimes(1, 3, ab));
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
                
                assert.deepEqual(parse.run(a, "abc"), ['a', 'b']);
                
                assert.deepEqual(parse.run(a, "aba"), ['a', 'b', 'a']);
                
                assert.deepEqual(parse.run(a, "aaba"), ['a', 'a', 'b']);
                
                assert.deepEqual(parse.run(a, "ababa"), ['a', 'b', 'a']);
            }],
            ["Consume Zero times",
             function(){
                var a = parse.eager(parse_lang.betweenTimes(0, 2, parse_text.character('a')));
                 
                 assert.deepEqual(parse.run(a, "aaa"), ['a', 'a']);
                 
                 assert.deepEqual(parse.run(a, ""), []);
            }],
             ["Consume Upper bound Infinite times",
             function(){
                var a = parse.eager(parse_lang.betweenTimes(2, Infinity, parse_text.character('a')));
                 
                 assert.deepEqual(parse.run(a, "aa"), ['a', 'a']);
                 
                 assert.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a', 'a', 'a']);
            }],
            ["Consume Too few",
            function(){
                var a = parse.eager(parse_lang.betweenTimes(3, 4, parse_text.character('a')));

                assert.throws(parse.run.bind(undefined, a, "aa"), parse.ExpectError);
                assert.throws(parse.run.bind(undefined, a, ""), parse.ExpectError);
             }],
             
             
             ["Consume Max lt Min",
             function(){
                assert.throws(function(){ parse_lang.betweenTimes(5, 1, parse_text.character('a')); }, parse.ParserError);
             }],
             ["Consume large input many",
             function(){
                 var a = parse.eager(parse_lang.betweenTimes(1000, 1500, parse_text.character('a')));
               
                 var input = (new Array(2000 + 1)).join('a');
               
                 var result = parse.run(a, input);
                 assert.deepEqual(result.length, 1500);
             }],
        ],
    };
});
