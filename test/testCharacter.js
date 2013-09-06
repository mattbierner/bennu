define(['parse/parse', 'parse/text'], function(parse, parse_text){
    
    return {
        'module': "parse_text.character",
        'tests': [
            ["String Object Char",
            function(){
                assert.deepEqual(parse.run(parse_text.character('a'), new String('a')), 'a');
                assert.deepEqual(parse.run(parse_text.character(new String('a')), 'a'), 'a');
                assert.deepEqual(parse.run(parse_text.character(new String('a')), new String('a')), 'a');
            }]
        ],
    };
});
