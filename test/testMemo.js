define(['parse/parse'], function(parse){
    return {
        'module': "Memo Tests",
        'tests': [
            ["Simple Memo",
            function(){
                var g = 0;
                
                var a = parse.memo(parse.bind(parse.character('a'), function(x) {
                    g++;
                    return parse.always(x);
                }));
                
                parse.run(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, parse.never())),
                        parse.sequence(a, a, a)),
                    "aaa");
                
                assert.deepEqual(g, 3);
            }]
        ],
    };
});
