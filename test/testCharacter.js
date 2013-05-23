define(['parse/parse'],
function(parse){
    return {
        'module': "parse.character",
        'tests': [
            ["Simple Char",
            function(){
                var p = parse.character('a');
                
                assert.deepEqual(parse.run(p, "a"), 'a');
                assert.deepEqual(parse.run(p, "ab"), 'a');
                
                assert.throws(parse.run.bind(undefined, p, ""), parse.UnexpectError);
                
                assert.throws(parse.run.bind(undefined, p, "z"), parse.UnexpectError);
            }],
            ["Multi Char",
            function(){
                 var p = parse.character('ab');
                 
                 assert.deepEqual(parse.run(p, ["ab"]), 'ab');
                 assert.deepEqual(parse.run(p, ["ab", 'c']), 'ab');
                 
                 assert.throws(parse.run.bind(undefined, p, ""), parse.UnexpectError);
                 assert.throws(parse.run.bind(undefined, p, "z"), parse.UnexpectError);
             }],
           
        ],
    };
});
