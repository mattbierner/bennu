define(['parse/parse',
        'parse/text',
        'nu/stream'],
function(parse,
        parse_text,
        stream){
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
            
            ["Memo Change streams",
            function(){
                var ga = 0, gb = 0;
                
                var a = parse.memo(parse.bind(parse_text.character('a'), function(x) {
                    ga++;
                    return parse.always(x);
                }));
                
                 var b = parse.memo(parse.bind(parse_text.character('b'), function(x) {
                    gb++;
                    return parse.always(x);
                }));
                 
                parse.run(
                    parse.sequence(
                        a,
                        a,
                        parse.setInput(stream.from('abb')),
                        parse.setPosition(new parse.Position(0)),
                        a,
                        b,
                        b),
                    "aaa");
                
                assert.deepEqual(ga, 3);
                assert.deepEqual(gb, 2);
            }],
        ],
    };
});
