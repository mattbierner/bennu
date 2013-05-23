define(['parse/parse'],
function(parse){
    return {
        'module': "parse.always",
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
