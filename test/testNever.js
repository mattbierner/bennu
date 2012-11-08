define(['parse'], function(parse){
    
    return {
        'module': "Never Tests",
        'tests': [
            ["Simple Never",
            function(){
                assert.throws(parse.run.bind(undefined, parse.never(), "abc"));
            }],
            ["Empty Never", 
            function(){
                assert.throws(parse.run.bind(undefined, parse.never(), ""));
            }]
        ],
    };
});
