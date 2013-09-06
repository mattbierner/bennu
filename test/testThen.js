define(['parse/parse', 'parse/text', 'parse/lang'], function(parse, parse_text, parse_lang){
    return {
        'module': "parse_lang.then",
        'tests': [
            ["Simple Then",
            function(){
                var a = parse_lang.then(parse_text.character('a'), parse_text.character('b'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
                
                assert.deepEqual(
                    parse.run(parse.next(a, parse_text.character('c')), "abc"),
                    'c');
            }],
            ["P fail Then",
            function(){
                var a = parse.either(
                    parse_lang.then(
                        parse.never(),
                        parse_text.character('b')),
                    parse_text.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
            ["Q fail Then",
            function(){
                var a = parse.either(
                    parse.attempt(parse_lang.then(
                        parse_text.character('a'),
                        parse.never('b'))),
                    parse_text.character('a'));
                
                assert.deepEqual(parse.run(a, "ab"), 'a');
            }],
        ],
    };
});
