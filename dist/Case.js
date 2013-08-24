/*! Case - v1.0.3 - 2013-08-23
* Copyright (c) 2013 Nathan Bubna; Licensed MIT, GPL */
(function() {
    "use strict";
    var re = {
        capitalize: /(^|\W|_)([a-z])/g,
        squish: /(^|[\W_])+([a-zA-Z])/g,
        fill: /[\W_]+(.|$)/g,
        sentence: /(^\s*|[\?\!\.]+"?\s+"?|,\s+")([a-z])/g,
        improper: /\b(A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\.?|Via)\b/g,
        relax: /([^A-Z])([A-Z]*)([A-Z])(?=[a-z]|$)/g,
        upper: /^[^a-z]+$/,
        hole: /\s/,
        room: /[\W_]/
    },
    _ = {
        re: re,
        types: [],
        up: String.prototype.toUpperCase,
        low: String.prototype.toLowerCase,
        cap: function(s) {
            return _.up.call(s.charAt(0))+s.slice(1);
        },
        decap: function(s) {
            return _.low.call(s.charAt(0))+s.slice(1);
        },
        fill: function(s, fill) {
            return !s || fill == null ? s : s.replace(re.fill, function(m, next) {
                return next ? fill + next : '';
            });
        },
        prep: function(s, fill, squish, upper) {
            if (!s){ return s || ''; }
            if (!upper && re.upper.test(s)) {
                s = _.low.call(s);
            }
            if (!fill && !re.hole.test(s)) {
                s = _.fill(s, ' ');
            }
            if (!squish && !re.room.test(s)) {
                s = s.replace(re.relax, _.relax);
            }
            return s;
        },
        relax: function(m, before, acronym, caps) {
            return before + ' ' + (acronym ? acronym+' ' : '') + caps;
        }
    },
    Case = {
        _: _,
        of: function(s) {
            for (var i=0,m=_.types.length; i<m; i++) {
                if (Case[_.types[i]](s) === s){ return _.types[i]; }
            }
        },
        flip: function(s) {
            return s.replace(/\w/g, function(l) {
                return l == _.up.call(l) ? _.low.call(l) : _.up.call(l);
            });
        },
        type: function(type, fn) {
            Case[type] = fn;
            _.types.push(type);
        }
    },
    types = {
        snake: function(s){ return Case.lower(s, '_'); },
        constant: function(s){ return Case.upper(s, '_'); },
        camel: function(s){ return _.decap(Case.squish(s)); },
        lower: function(s, fill) {
            return _.fill(_.low.call(_.prep(s, fill)), fill);
        },
        upper: function(s, fill) {
            return _.fill(_.up.call(_.prep(s, fill, false, true)), fill);
        },
        capital: function(s, fill) {
            return _.fill(_.prep(s).replace(re.capitalize, function(m, border, letter) {
                return border+_.up.call(letter);
            }), fill);
        },
        squish: function(s) {
            return _.fill(_.prep(s, false, true).replace(re.squish, function(m, border, letter) {
                return _.up.call(letter);
            }), '');
        },
        title: function(s) {
            return Case.capital(s).replace(re.improper, function(small) {
                return _.low.call(small);
            });
        },
        sentence: function(s, names) {
            s = Case.lower(s).replace(re.sentence, function(m, prelude, letter) {
                return prelude + _.up.call(letter);
            });
            if (names) {
                names.forEach(function(name) {
                    s = s.replace(new RegExp('\\b'+Case.lower(name)+'\\b', "g"), _.cap);
                });
            }
            return s;
        }
    };

    for (var type in types) {
        Case.type(type, types[type]);
    }
    if (typeof define === 'function' && define.amd) {
        define(function(){ return Case; });
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Case;
    } else {
        this.Case = Case;
    }
}).call(this);
