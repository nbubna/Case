/*
 * Copyright (c) 2013 ESHA Research
 * License under the MIT license.
 */
(function() {
    var re = {
        // conversion
        uncapital: /(^|\W|_)([a-z])/g,
        unsnake: /[^\w]/g,
        uncamel: /[^a-zA-Z]+([a-zA-Z])/g,
        improper: /\b(A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\.?|Via)\b/g,
        // normalization
        desnake: /_/g,
        decamel: /(\w)([A-Z])/g,
        unclean: /[^\w ]/g,
        upper: /^[^a-z]+$/
    },
    _ = {
        re: re,
        up: String.prototype.toUpperCase,
        low: String.prototype.toLowerCase,
        normal: function(s, snake, camel, upper) {
            if (!s){ return s || ''; }
            if (!upper && re.upper.test(s)) {
                s = _.low.call(s);
            }
            if (s.search(/\s/) < 0) {
                if (!snake){ s = s.replace(re.desnake, ' '); }
                if (!camel){ s = s.replace(re.decamel, '$1 $2'); }
            }
            return snake || camel ? _.clean(s) : s;
        },
        clean: function(s) {
            return s.replace(re.unclean, '');
        },
        capitalize: function(s) {
            return _.up.call(s.charAt(0))+s.substr(1);
        },
        types: 'upper snake lower camel capital sentence title'.split(' ')
    },
    Case = {
        _: _,
        of: function(s) {
            for (var i=0,m=_.types.length; i<m; i++) {
                if (Case[_.types[i]](s) === s){ return _.types[i]; }
            }
        },
        lower: function(s) {
            return _.low.call(_.normal(s));
        },
        upper: function(s) {
            return _.up.call(_.normal(s,0,0,1));
        },
        sentence: function(s, names) {
            s = Case.lower(s)
                .replace(/\w/, function(letter){ return _.up.call(letter); });
            if (names) {
                for (var i=0,m=names.length; i<m; i++) {
                    s = s.replace(new RegExp(names[i]), _.capitalize);
                }
            }
            return s;
        },
        capital: function(s) {
            return _.normal(s).replace(re.uncapital, function(m, border, letter) {
                return border+_.up.call(letter);
            });
        },
        title: function(s) {
            return Case.capital(s).replace(re.improper, function(match) {
                return _.low.call(match);
            });
        },
        snake: function(s) {
            return _.low.call(_.normal(s,1)).replace(re.unsnake, '_');
        },
        camel: function(s) {
            s = _.normal(s,0,1).replace(re.uncamel, function(m, letter) {
                return _.up.call(letter);
            });
            return _.low.call(s.charAt(0)) + s.substr(1);
        }
    };
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Case;
    } else {
        this.Case = Case;
    }
})();
