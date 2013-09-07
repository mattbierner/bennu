define(['parse/parse', 'parse/text'], function(parse, parse_text){
    
    return {
        'module': "parse_text.string",
        'tests': [
           ["Simple",
           function(){
                assert.deepEqual(parse.run(parse_text.string('abc'), 'abc'), 'abc');
                assert.deepEqual(parse.run(parse_text.string('abc'), 'abcd'), 'abc');
                assert.deepEqual(parse.run(parse.next(parse_text.string('abc'), parse_text.anyChar), 'abcd'), 'd');

                assert.throws(parse.run.bind(undefined, parse_text.string('abc'), 'ab'), parse.ExpectError);
                assert.throws(parse.run.bind(undefined, parse_text.string('abc'), ''), parse.ExpectError);
                assert.throws(parse.run.bind(undefined, parse_text.string('abc'), 'abx'), parse.ExpectError);
            }],
            ["String Objects",
            function(){
                assert.deepEqual(parse.run(parse_text.string('abc'), new String('abc')), 'abc');
                assert.deepEqual(parse.run(parse_text.string(new String('abc')), 'abc'), 'abc');
                assert.deepEqual(parse.run(parse_text.string(new String('abc')), new String('abc')), 'abc');
            }],
            ["Failure Consumes Nothing",
            function(){
                var abcOrX = parse.choice(
                    parse_text.string('abc'),
                    parse_text.character('x'));
                var abcOrA = parse.choice(
                    parse_text.string('abc'),
                    parse_text.character('a'));
                
                assert.deepEqual(parse.run(abcOrX, 'abc'), 'abc');
                assert.deepEqual(parse.run(abcOrX, 'x'), 'x');
                assert.deepEqual(parse.run(parse.next(abcOrA, parse_text.anyChar), 'ab'), 'b');
            }],
        ],
    };
});
