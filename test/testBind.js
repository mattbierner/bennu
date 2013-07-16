define(['parse/parse'],
function(parse){
    
    var identity = function(v) { return v; };
    var constant = function(v) { return identity.bind(this, v); };
    
    return {
        'module': "parse.bind",
        'tests': [
            ["Simple bind",
            function(){
                var result = parse.run(parse.bind(parse.always(3), function(x) {
                    return parse.always(x + 5);
                }), "abc");
                assert.deepEqual(result, 8);
            }],
            ["Id Bind",
            function(){
                var result = parse.run(parse.bind(parse.always(3), constant(parse.always(5))), "abc");
                assert.deepEqual(result, 5);
            }],
            ["fail Bind",
            function(){
                var result = parse.run(
                    parse.either(
                        parse.bind(parse.never(), constant(parse.always(5))),
                        parse.always(10)), "abc");
                assert.deepEqual(result, 10);
            }],
        ],
    };
});
