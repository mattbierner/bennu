define(['parse'], function(parse){
    
    return {
        'module': "Between Times Tests",
        'tests': [
            ["Greedy Consume Times items",
            function(){
                var a = parse.betweenTimes(1, 3, parse.char('a'));
                
                assert.deepEqual(parse.run(a, "a"), ['a']);
                
                assert.deepEqual(parse.run(a, "aa"), ['a', 'a']);
                
                assert.deepEqual(parse.run(a, "aaa"), ['a', 'a', 'a']);
                
                assert.deepEqual(parse.run(a, "aaaaa"), ['a', 'a', 'a']);
            }],
            ["Consume Zero times",
             function(){
                var a = parse.betweenTimes(0, 2, parse.char('a'));
                 
                 assert.deepEqual(parse.run(a, "aaa"), ['a', 'a']);
                 
                 assert.deepEqual(parse.run(a, ""), []);
            }],
            ["Consume Too few",
            function(){
                var a = parse.betweenTimes(3, 4, parse.char('a'));

                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Consume Max lt Min",
             function(){
                var a = parse.betweenTimes(5, 1, parse.char('a'));
                
                assert.throws(parse.run.bind(undefined, a, "aa"));
                assert.throws(parse.run.bind(undefined, a, ""));
             }],
             ["Consume large input many",
             function(){
                 var a = parse.betweenTimes(1000, 1500, parse.char('a'));
               
                 var input = (new Array(2000 + 1)).join('a');
               
                 var result = parse.run(a, input);
                 assert.deepEqual(result.length, 1500);
             }],
        ],
    };
});
