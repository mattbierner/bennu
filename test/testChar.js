define(['parse'], function(parse){
    
    return {
        'module': "Char Tests",
        'tests': [
            ["Simple Char",
            function(){
                var p = parse.char('a');
                
                assert.deepEqual(parse.run(p, "a"), 'a');
                assert.deepEqual(parse.run(p, "ab"), 'a');
                
                assert.throws(parse.run.bind(undefined, p, ""));
            }],
            ["String Object",
            function(){
                assert.deepEqual(parse.run(parse.char('a'), new String('a')), 'a');
                assert.deepEqual(parse.run(parse.char(new String('a')), 'a'), 'a');
                assert.deepEqual(parse.run(parse.char(new String('a')), new String('a')), 'a');
            }],
            ["Multi Char",
             function(){
                 var p = parse.char('ab');
                 
                 assert.deepEqual(parse.run(p, ["ab"]), 'ab');
                 assert.deepEqual(parse.run(p, ["ab", 'c']), 'ab');
                 
                 assert.throws(parse.run.bind(undefined, p, ""));
             }],
           
        ],
    };
});
