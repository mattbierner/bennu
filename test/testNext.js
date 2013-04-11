define(['parse/parse'], function(parse){
    
    return {
        'module': "Next Tests",
        'tests': [
            ["Simple Next",
            function(){
                var result = parse.run(
                    parse.next(
                        parse.always(3),
                        parse.always(5)),
                    "");
                assert.deepEqual(result, 5);
            }],
        ],
    };
});
