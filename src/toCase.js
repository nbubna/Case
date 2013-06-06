/*
 * Copyright (c) 2013 ESHA Research
 * License under the MIT license.
 * 
 * Use at your own risk; this changes the behavior
 * of toUpperCase, toLowerCase and for-in on strings.
 */
(function(Case, _) {
    function create(type) {
        var fn = 'to'+_.capitalize(type)+'Case';
        String.prototype[fn] = function() {
            return Case[type](this);
        };
    }
    for (var i=0,m=_.types.length; i<m; i++) {
        create(_.types[i]);
    }
})(Case, Case._);
