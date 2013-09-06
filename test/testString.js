define(['parse/parse', 'parse/text'], function(parse, parse_text){
    
    return {
        'module': "parse_text.string",
        'tests': [
            ["String Object String",
            function(){
                 assert.deepEqual(parse.run(parse_text.string('abc'), new String('abc')), 'abc');
                 assert.deepEqual(parse.run(parse_text.string(new String('abc')), 'abc'), 'abc');
                 assert.deepEqual(parse.run(parse_text.string(new String('abc')), new String('abc')), 'abc');
            }],
        ],
    };
});
