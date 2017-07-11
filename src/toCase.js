/*
 * Copyright (c) 2013 ESHA Research
 * License under the MIT license.
 * 
 * Use at your own risk; this changes the behavior
 * of toUpperCase, toLowerCase and for-in loops on strings (which is itself a bad idea).
 */
(function(Case, _) {
    function create(type) {
        var fn = 'to'+_.cap(type)+'Case';
        String.prototype[fn] = function() {
            Array.prototype.unshift.call(arguments, this);
            return Case[type].apply(Case, arguments);
        };
    }
    for (var i=0,m=_.types.length; i<m; i++) {
        create(_.types[i]);
    }
    var _type = Case.type;
    Case.type = function(type, fn) {
        _type(type, fn);
        create(type);
    };
})(Case, Case._);
