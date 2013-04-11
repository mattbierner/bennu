define(['parse/parse'], function(parse){
    
    return {
        'module': "Either Tests",
        'tests': [
            ["P Either",
            function(){
                var result = parse.run(
                    parse.either(
                        parse.always(3),
                        parse.always(5)),
                    "abc"
                );
                assert.deepEqual(result, 3);
            }],
            ["Q Either", 
            function(){
                var result = parse.run(
                    parse.either(
                        parse.never(),
                        parse.always(5)),
                    "abc"
                );
                assert.deepEqual(result, 5);
            }],
            ["Both Fail", 
             function(){
                 assert.throws(parse.run.bind(undefined,
                     parse.either(
                         parse.never(),
                         parse.never()),
                     "abc"
                 ));
             }],
        ],
    };
});
