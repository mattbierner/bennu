define(['parse/parse', 'parse/string'], function(parse, parse_string){
    
    return {
        'module': "parse_string.character",
        'tests': [
            ["String Object Char",
            function(){
                assert.deepEqual(parse.run(parse_string.character('a'), new String('a')), 'a');
                assert.deepEqual(parse.run(parse_string.character(new String('a')), 'a'), 'a');
                assert.deepEqual(parse.run(parse_string.character(new String('a')), new String('a')), 'a');
            }]
        ],
    };
});
