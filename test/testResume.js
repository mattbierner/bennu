define(['parse/parse', 'parse/text', 'parse/lang', 'parse/resume', 'nu/stream'],
function(parse, parse_text, parse_lang, resume, stream){
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
                var p = resume.parse(ab);
                assert.equal(resume.finish(resume.provideString(p, 'a')), 'a');
                assert.equal(resume.finish(resume.provideString(p, 'b')), 'b');
            }],
            ["multiple parser",
            function(){
                var p = resume.parse(parse.eager(parse.many(ab)));
                assert.deepEqual(resume.finish(resume.provideString(p, 'a')), ['a']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'b')), ['b']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'abba')), ['a', 'b', 'b', 'a']);
                assert.deepEqual(resume.finish(resume.provideString(p, 'babab')), ['b', 'a', 'b', 'a','b']);
             }],
            ["multiple provides",
            function(){
                var p = resume.parse(parse.eager(parse.many(ab)));
                var r = resume.provideString(p, 'a');
                assert.deepEqual(resume.finish(resume.provideString(r, 'a')), ['a', 'a']);
                assert.deepEqual(resume.finish(resume.provideString(r, 'b')), ['a', 'b']);
             }],
             
             ["Backtracking simple",
             function(){
                var p = resume.parse(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, a)),
                        parse.sequence(a, a, b)));
                assert.deepEqual(resume.finish(resume.provideString(p, 'aaa')), 'a');
                assert.deepEqual(resume.finish(resume.provideString(p, 'aab')), 'b');
             }],
              ["Backtracking half provided",
             function(){
                var p = resume.parse(
                    parse.either(
                        parse.attempt(parse.sequence(a, a, a)),
                        parse.sequence(a, a, b)));
                var r = resume.provideString(p, 'aa');
                assert.deepEqual(resume.finish(resume.provideString(r, 'a')), 'a');
                assert.deepEqual(resume.finish(resume.provideString(r, 'b')), 'b');
             }],
        ],
    };
});
