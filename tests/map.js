var parse = require('../index').parse;

exports.simple = function(test) {
    var result = parse.anyToken
        .map(function(x) {
            return (+x) + 5;
        })
        .map(function(x) {
            return x / 2;
        });
    
    test.deepEqual(
        parse.run(result, "3"),
        4);
    test.done();
};