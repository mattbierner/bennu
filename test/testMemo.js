define(['parse/parse', 'parse/text'], function(parse, parse_text){
    return {
        'module': "Memo Tests",
        'tests': [
            ["Simple Memo",
            function(){
                var g = 0;
                
                var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
                    g++;
                    return parse.always(x);
                }));
                
                parse.run(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, parse.never())),
                        parse.sequence(a, a, a)),
                    "aaa");
                
                assert.deepEqual(g, 3);
            }],
            ["Parser Memo",
            function(){
                var g = 0;
                
                var a = parse.Parser('a', parse.bind(parse_text.character('a'), function(x) {
                    g++;
                    return parse.always(x);
                }));
                
                parse.run(
                    parse.either(
                        parse.attempt(parse.sequence(parse.memo(a), parse.memo(a), parse.never())),
                        parse.sequence(parse.memo(a), parse.memo(a), parse.memo(a))),
                    "aaa");
                
                assert.deepEqual(g, 3);
            }],
            ["Nested Memo",
            function(){
                var g = 0;
                
                var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
                    g++;
                    return parse.always(x);
                }));
                
                parse.run(
                    parse.either(
                        parse.attempt(parse.either(
                            parse.attempt(parse.sequence(a, parse.never())),
                            parse.sequence(a, a, parse.never()))),
                        parse.sequence(a, a, a)),
                    "aaa");
                
                assert.deepEqual(g, 3);
            }],
        ],
    };
});
