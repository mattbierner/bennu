define(['parse', 'parse_string'], function(parse, parse_string){
    
    return {
        'module': "Parse String Tests",
        'tests': [
            ["String Object Char",
            function(){
                assert.deepEqual(parse.run(parse_string.char('a'), new String('a')), 'a');
                assert.deepEqual(parse.run(parse_string.char(new String('a')), 'a'), 'a');
                assert.deepEqual(parse.run(parse_string.char(new String('a')), new String('a')), 'a');
            }],
            ["String Object String",
            function(){
                 assert.deepEqual(parse.run(parse_string.string('abc'), new String('abc')), 'abc');
                 assert.deepEqual(parse.run(parse_string.string(new String('abc')), 'abc'), 'abc');
                 assert.deepEqual(parse.run(parse_string.string(new String('abc')), new String('abc')), 'abc');
            }],
        ],
    };
});
