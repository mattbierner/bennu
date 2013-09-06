define(['parse/parse', 'parse/string', 'parse/lang'], function(parse, parse_string, parse_lang){
    return {
        'module': "parse_lang.then",
        'tests': [
            ["Simple Then",
            function(){
                var a = parse_lang.then(parse_string.character('a'), parse_string.character('b'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
                
                assert.deepEqual(
                    parse.run(parse.next(a, parse_string.character('c')), "abc"),
                    'c');
            }],
            ["P fail Then",
            function(){
                var a = parse.either(
                    parse_lang.then(
                        parse.never(),
                        parse_string.character('b')),
                    parse_string.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
            ["Q fail Then",
            function(){
                var a = parse.either(
                    parse.attempt(parse_lang.then(
                        parse_string.character('a'),
                        parse.never('b'))),
                    parse_string.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
        ],
    };
});
