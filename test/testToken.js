define(['parse'], function(parse){
    
    return {
        'module': "Token Tests",
        'tests': [
            ["Always Consume Token",
            function(){
                var any = parse.token(function() { return true; });
                
                assert.deepEqual(parse.run(any, "abc"), 'a');
                
                assert.throws(parse.run.bind(undefined,
                        any, ""
                    )
                );
            }],
            ["Never Consume Token",
            function(){
                 assert.throws(
                     parse.run.bind(undefined,
                         parse.token(function() { return false; }),
                         "abc"
                     )
                 );
             }],
           
        ],
    };
});
