define(['parse'], function(parse){
    
    return {
        'module': "Always Tests",
        'tests': [
            ["Simple Always",
            function(){
                var result = parse.run(parse.always(5), "abc");
                assert.deepEqual(result, 5);
            }],
            ["Empty Input Always",
            function(){
                 var result = parse.run(parse.always(5), "");
                 assert.deepEqual(result, 5);
             }],
        ],
    };
});
