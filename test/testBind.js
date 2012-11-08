define(['parse'], function(parse){
    
    var identity = function(v) { return v; };
    var constant = function(v) { return identity.bind(this, v); };
    
    return {
        'module': "Bind Tests",
        'tests': [
            ["Simple Bind",
            function(){
                var result = parse.run(parse.bind(parse.always(3), function(x) {
                    return parse.always(x + 5);
                }, "abc"));
                assert.deepEqual(result, 8);
            }],
            ["Id Bind",
            function(){
                var result = parse.run(parse.bind(parse.always(3), constant(parse.always(5))), "abc");
                assert.deepEqual(result, 5);
            }],
        ],
    };
});
