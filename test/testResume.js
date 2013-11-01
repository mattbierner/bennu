define(['parse/parse',
        'parse/text',
        'parse/lang',
        'parse/incremental',
        'nu/stream',
        'nu/gen'],
function(parse,
        parse_text,
        parse_lang,
        resume,
        stream,
        gen)
{
    
    var a = parse_text.character('a'),
        b =  parse_text.character('b');
    
    var ab = parse.either(
            parse_text.character('a'),
            parse_text.character('b'));
    
    return {
        'module': "Resume",
        'tests': [
            ["Simple items",
            function(){
                var p = resume.runInc(ab);
                assert.equal(resume.finish(resume.provideString(p, 'a')), 'a');
                assert.equal(resume.finish(resume.provideString(p, 'b')), 'b');
            }],
            
            ["multiple parser",
            function(){
                var p = resume.runInc(parse.eager(parse.many(ab)));
                assert.deepEqual(resume.finish(resume.provideString(p, 'a')), ['a']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'b')), ['b']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'abba')), ['a', 'b', 'b', 'a']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'babab')), ['b', 'a', 'b', 'a','b']);
             }],
            ["multiple provides",
            function(){
                var p = resume.runInc(parse.eager(parse.many(ab)));
                var r = resume.provideString(p, 'a');
                assert.deepEqual(resume.finish(resume.provideString(r, 'a')), ['a', 'a']);
                assert.deepEqual(resume.finish(resume.provideString(r, 'b')), ['a', 'b']);
             }],
             ["provides to much",
            function(){
                var p = resume.runInc(parse.eager(parse.enumeration(a, a, a)));
                var r = resume.provideString(p, 'aaaaaa');
                assert.deepEqual(resume.finish(resume.provideString(r, 'a')), ['a', 'a', 'a']);
             }],
             ["provides empty",
            function(){
                var p = resume.runInc(parse.eager(parse.enumeration(a, a, a)));
                var r = resume.provideString(p, 'aa');
                var r1 = resume.provideString(r, '');
                var r2 = resume.provideString(r1, '');
                
                assert.deepEqual(resume.finish(resume.provideString(r2, 'a')), ['a', 'a', 'a']);
             }],
             
             ["Backtracking simple",
             function(){
                var p = resume.runInc(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, a)),
                        parse.sequence(a, a, b)));
                assert.deepEqual(resume.finish(resume.provideString(p, 'aaa')), 'a');
                assert.deepEqual(resume.finish(resume.provideString(p, 'aab')), 'b');
             }],
             ["Backtracking half provided",
             function(){
                var p = resume.runInc(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, a)),
                        parse.sequence(a, a, b)));
                var r = resume.provideString(p, 'aa');
                assert.deepEqual(resume.finish(resume.provideString(r, 'a')), 'a');
                assert.deepEqual(resume.finish(resume.provideString(r, 'b')), 'b');
             }],
             ["Backtracking multi provides",
             function(){
                var p = resume.runInc(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, a)),
                        parse.sequence(a, a, b)));
                var r = resume.provideString(p, 'a');
                var r2 = resume.provideString(r, 'a');

                assert.deepEqual(resume.finish(resume.provideString(r2, 'a')), 'a');
                assert.deepEqual(resume.finish(resume.provideString(r2, 'b')), 'b');
             }],
             
             ["eof",
             function(){
                var p = resume.runInc(
                    parse_lang.then(
                        parse.eager(parse.enumeration(a, a, a)),
                        parse.eof));
                
                assert.deepEqual(resume.finish(resume.provideString(p, 'aaa')), ['a', 'a', 'a']);
             }],
             ["Not eof",
             function(){
                var p = resume.runInc(
                    parse_lang.then(
                        parse.eager(parse.enumeration(a, a)),
                        parse.eof));
                
                assert.throws(function(){
                    resume.finish(resume.provideString(p, 'aaa'));
                });
             }],
             ["Multi feed does not trigger eof",
             function(){
                var p = resume.runInc(
                    parse_lang.then(
                        parse.eager(parse.enumeration(a, a, a)),
                        parse.eof));
                
                var r = resume.provideString(p, 'a');
                var r1 = resume.provideString(r, 'a');
                var r2 = resume.provideString(r1, 'a');

                assert.deepEqual(
                    resume.finish(r2),
                    ['a', 'a', 'a']);
             }],
             ["Multi feed does not trigger eof with failure",
             function(){
                var p = resume.runInc(
                    parse_lang.then(
                        parse.eager(parse.enumeration(a, a)),
                        parse.eof));
                
                var r = resume.provideString(p, 'a');
                var r1 = resume.provideString(r, 'a');
                var r2 = resume.provideString(r1, 'a');

                assert.throws(function(){
                    resume.finish(r2);
                });
             }],
             
             ["provide inf source",
             function(){
                var p = resume.runInc(
                    parse.eager(parse_lang.times(3, a)));
                
                assert.deepEqual(
                    resume.finish(resume.provide(p, gen.repeat(Infinity, 'a'))),
                    ['a', 'a', 'a']);
             }],
             
             ["provide with starting input",
             function(){
                var p = resume.runIncState(
                    parse.eager(parse.enumeration(a, a, b, a)),
                    new parse.ParserState(
                        stream.from('aa'),
                        parse.Position.initial,
                        null));
                
                var r = resume.provideString(p, 'b');
                var r2 = resume.provideString(r, 'a');
                assert.deepEqual(
                    resume.finish(r2),
                    ['a', 'a', 'b', 'a']);
             }],
        ],
    };
});
