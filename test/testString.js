define(['parse/parse', 'parse/string'], function(parse, parse_string){
    
    return {
        'module': "parse_string.string",
        'tests': [
            ["String Object String",
            function(){
                 assert.deepEqual(parse.run(parse_string.string('abc'), new String('abc')), 'abc');
                 assert.deepEqual(parse.run(parse_string.string(new String('abc')), 'abc'), 'abc');
                 assert.deepEqual(parse.run(parse_string.string(new String('abc')), new String('abc')), 'abc');
            }],
        ],
    };
});
