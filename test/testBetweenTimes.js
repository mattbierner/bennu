define(['parse'], function(parse){
    var ab = parse.either(
        parse.attempt(parse.character('a')),
        parse.character('b')
    );
    
    
    return {
        'module': "Between Times Tests",
        'tests': [
            ["Greedy Consume Times items",
            function(){
                var a = parse.betweenTimes(1, 3, ab);
                
                assert.deepEqual(parse.run(a, "ab"), ['a', 'b']);
                
                assert.deepEqual(parse.run(a, "abc"), ['a', 'b']);
                
                assert.deepEqual(parse.run(a, "aba"), ['a', 'b', 'a']);
                
                assert.deepEqual(parse.run(a, "aaba"), ['a', 'a', 'b']);
                
                assert.deepEqual(parse.run(a, "ababa"), ['a', 'b', 'a']);
            }],
            ["Consume Zero times",
             function(){
                var a = parse.betweenTimes(0, 2, parse.character('a'));
                 
                 assert.deepEqual(parse.run(a, "aaa"), ['a', 'a']);
                 
                 assert.deepEqual(parse.run(a, ""), []);
            }],
            ["Consume Too few",
            function(){
                var a = parse.betweenTimes(3, 4, parse.character('a'));

                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Consume Max lt Min",
             function(){
                var a = parse.betweenTimes(5, 1, parse.character('a'));
                
                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Consume large input many",
             function(){
                 var a = parse.betweenTimes(1000, 1500, parse.character('a'));
               
                 var input = (new Array(2000 + 1)).join('a');
               
                 var result = parse.run(a, input);
                 assert.deepEqual(result.length, 1500);
             }],
        ],
    };
});
