define(['parse/parse'], function(parse){
    
    return {
        'module': "Never Tests",
        'tests': [
            ["Simple Never",
            function(){
                assert.throws(
                    parse.run.bind(undefined, parse.never(), "abc"),
                    parse.UnknownError);
            }],
            ["Empty Never", 
            function(){
                assert.throws(
                    parse.run.bind(undefined, parse.never(), ""),
                    parse.UnknownError);
            }]
        ],
    };
});
