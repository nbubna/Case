/*
 * Copyright (c) 2014 ESHA Research
 * License under the MIT license.
 */
(function() {
    "use strict";
    var unicodes = function(s, prefix) {
        prefix = prefix || '';
        return s.replace(/(^|-)/g, '$1\\u'+prefix).replace(/,/g, '\\u'+prefix);
    },
    basicSymbols = unicodes('20-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7', '00'),
    baseLowerCase = 'a-z'+unicodes('DF-F6,F8-FF', '00'),
    baseUpperCase = 'A-Z'+unicodes('C0-D6,D8-DE', '00'),
    improperInTitle = 'A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via',
    regexps = function(symbols, lowers, uppers, impropers) {
        symbols = symbols || basicSymbols;
        lowers = lowers || baseLowerCase;
        uppers = uppers || baseUpperCase;
        impropers = impropers || improperInTitle;
        return {
            capitalize: new RegExp('(^|['+symbols+'])(['+lowers+'])', 'g'),
            pascal: new RegExp('(^|['+symbols+'])+(['+lowers+uppers+'])', 'g'),
            fill: new RegExp('['+symbols+']+(.|$)','g'),
            sentence: new RegExp('(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")(['+lowers+'])', 'g'),
            improper: new RegExp('\\b('+impropers+')\\b', 'g'),
            relax: new RegExp('([^'+uppers+'])(['+uppers+']*)(['+uppers+'])(?=['+lowers+']|$)', 'g'),
            upper: new RegExp('^[^'+lowers+']+$'),
            hole: /\s/,
            room: new RegExp('['+symbols+']')
        };
    },
    re = regexps(),
    _ = {
        re: re,
        unicodes: unicodes,
        regexps: regexps,
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
        prep: function(s, fill, pascal, upper) {
            if (!s){ return s || ''; }
            if (!upper && re.upper.test(s)) {
                s = _.low.call(s);
            }
            if (!fill && !re.hole.test(s)) {
                s = _.fill(s, ' ');
            }
            if (!pascal && !re.room.test(s)) {
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
        camel: function(s){ return _.decap(Case.pascal(s)); },
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
        pascal: function(s) {
            return _.fill(_.prep(s, false, true).replace(re.pascal, function(m, border, letter) {
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
    
    // TODO: Remove "squish" in a future breaking release.
    types.squish = types.pascal;

    for (var type in types) {
        Case.type(type, types[type]);
    }
    // export Case (AMD, commonjs, or global)
    var define = this.define || function(){};
    define(this.module && module.exports ? module.exports = Case : this.Case = Case);

}).call(this);
