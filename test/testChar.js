define(['parse'], function(parse){
    
    return {
        'module': "Char Tests",
        'tests': [
            ["Simple Char",
            function(){
                var p = parse.character('a');
                
                assert.deepEqual(parse.run(p, "a"), 'a');
                assert.deepEqual(parse.run(p, "ab"), 'a');
                
                assert.throws(parse.run.bind(undefined, p, ""));
            }],
            ["Multi Char",
            function(){
                 var p = parse.character('ab');
                 
                 assert.deepEqual(parse.run(p, ["ab"]), 'ab');
                 assert.deepEqual(parse.run(p, ["ab", 'c']), 'ab');
                 
                 assert.throws(parse.run.bind(undefined, p, ""));
             }],
           
        ],
    };
});
