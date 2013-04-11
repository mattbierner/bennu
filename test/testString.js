define(['parse/parse'], function(parse){
    
    return {
        'module': "String Tests",
        'tests': [
            ["Simple String",
            function(){
                var p = parse.string('abc');
                
                assert.deepEqual(parse.run(p, "abc"), 'abc');
                assert.deepEqual(parse.run(p, "abcd"), 'abc');
                
                assert.throws(parse.run.bind(undefined, p, "ab"));
            }],
            ["Char Array String",
             function(){
                 var p = parse.string('abc');
                 
                 assert.deepEqual(parse.run(p, ["a", "b", "c"]), 'abc');
                 
                 assert.throws(parse.run.bind(undefined, p, ["ab"], 'ab'));
             }],
           
        ],
    };
});
