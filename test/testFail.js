define(['parse/parse'], function(parse){
    return {
        'module': "Fail Tests",
        'tests': [
            ["Simple Fail",
            function(){
                assert.throws(
                    parse.run.bind(undefined, parse.fail(), "abc"),
                    parse.UnknownError);
                assert.throws(
                    parse.run.bind(undefined, parse.fail(), ""),
                    parse.UnknownError);
            }],
            ["Message Fail", 
            function(){
                assert.throws(
                    parse.run.bind(undefined, parse.fail("error"), ""),
                    parse.ParseError);
            }]
        ],
    };
});
