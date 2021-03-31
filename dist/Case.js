(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Case = factory());
}(this, (function () { 'use strict';

    function unicodes(s, prefix) {
        prefix = prefix || '';
        return s.replace(/(^|-)/g, '$1\\u' + prefix).replace(/,/g, '\\u' + prefix);
    }

    const basicSymbols = unicodes(
        '20-26,28-2F,3A-40,5B-60,7B-7E,A0-BF,D7,F7',
        '00',
    );
    const baseLowerCase = 'a-z' + unicodes('DF-F6,F8-FF', '00');
    const baseUpperCase = 'A-Z' + unicodes('C0-D6,D8-DE', '00');
    const improperInTitle =
        'A|An|And|As|At|But|By|En|For|If|In|Of|On|Or|The|To|Vs?\\.?|Via';

    function regexps(symbols, lowers, uppers, impropers) {
        symbols = symbols || basicSymbols;
        lowers = lowers || baseLowerCase;
        uppers = uppers || baseUpperCase;
        impropers = impropers || improperInTitle;
        return {
            capitalize: new RegExp('(^|[' + symbols + '])([' + lowers + '])', 'g'),
            pascal: new RegExp(
                '(^|[' + symbols + '])+([' + lowers + uppers + '])',
                'g',
            ),
            fill: new RegExp('[' + symbols + ']+(.|$)', 'g'),
            sentence: new RegExp(
                '(^\\s*|[\\?\\!\\.]+"?\\s+"?|,\\s+")([' + lowers + '])',
                'g',
            ),
            improper: new RegExp('\\b(' + impropers + ')\\b', 'g'),
            relax: new RegExp(
                '([^' +
                    uppers +
                    '])([' +
                    uppers +
                    ']*)([' +
                    uppers +
                    '])(?=[^' +
                    uppers +
                    ']|$)',
                'g',
            ),
            upper: new RegExp('^[^' + lowers + ']+$'),
            hole: /[^\s]\s[^\s]/,
            apostrophe: /'/g,
            room: new RegExp('[' + symbols + ']'),
        };
    }

    const re = regexps();

    const up = String.prototype.toUpperCase;
    const low = String.prototype.toLowerCase;
    function cap(s) {
        return up.call(s.charAt(0)) + s.slice(1);
    }
    function decap(s) {
        return low.call(s.charAt(0)) + s.slice(1);
    }
    function deapostrophe(s) {
        return s.replace(re.apostrophe, '');
    }
    function fill(s, fill, _deapostrophe) {
        if (fill != null) {
            s = s.replace(re.fill, function (m, next) {
                return next ? fill + next : '';
            });
        }
        if (_deapostrophe) {
            s = deapostrophe(s);
        }
        return s;
    }
    function prep(s, _fill, pascal, upper) {
        s = s == null ? '' : s + ''; // force to string
        if (!upper && re.upper.test(s)) {
            s = low.call(s);
        }
        if (!_fill && !re.hole.test(s)) {
            var holey = fill(s, ' ');
            if (re.hole.test(holey)) {
                s = holey;
            }
        }
        if (!pascal && !re.room.test(s)) {
            s = s.replace(re.relax, relax);
        }
        return s;
    }
    function relax(m, before, acronym, caps) {
        return before + ' ' + (acronym ? acronym + ' ' : '') + caps;
    }

    var _ = /*#__PURE__*/Object.freeze({
        __proto__: null,
        unicodes: unicodes,
        regexps: regexps,
        re: re,
        up: up,
        low: low,
        cap: cap,
        decap: decap,
        deapostrophe: deapostrophe,
        fill: fill,
        prep: prep,
        relax: relax
    });

    function lower(s, fill$1, deapostrophe) {
        return fill(low.call(prep(s, fill$1)), fill$1, deapostrophe);
    }
    function snake(s) {
        return lower(s, '_', true);
    }
    function constant(s) {
        return upper(s, '_', true);
    }
    function camel(s) {
        return decap(pascal(s));
    }
    function kebab(s) {
        return lower(s, '-', true);
    }
    function upper(s, fill$1, deapostrophe) {
        return fill(up.call(prep(s, fill$1, false, true)), fill$1, deapostrophe);
    }
    function capital(s, fill$1, deapostrophe) {
        return fill(
            prep(s).replace(re.capitalize, function (m, border, letter) {
                return border + up.call(letter);
            }),
            fill$1,
            deapostrophe,
        );
    }
    function header(s) {
        return capital(s, '-', true);
    }
    function pascal(s) {
        return fill(
            prep(s, false, true).replace(re.pascal, function (m, border, letter) {
                return up.call(letter);
            }),
            '',
            true,
        );
    }
    function title(s) {
        return capital(s).replace(re.improper, function (small, p, i, s) {
            return i > 0 && i < s.lastIndexOf(' ') ? low.call(small) : small;
        });
    }
    function sentence(s, names, abbreviations) {
        s = lower(s).replace(re.sentence, function (m, prelude, letter) {
            return prelude + up.call(letter);
        });
        if (names) {
            names.forEach(function (name) {
                s = s.replace(new RegExp('\\b' + lower(name) + '\\b', 'g'), cap);
            });
        }
        if (abbreviations) {
            abbreviations.forEach(function (abbr) {
                s = s.replace(
                    new RegExp('(\\b' + lower(abbr) + '\\. +)(\\w)'),
                    function (m, abbrAndSpace, letter) {
                        return abbrAndSpace + low.call(letter);
                    },
                );
            });
        }
        return s;
    }

    var types = /*#__PURE__*/Object.freeze({
        __proto__: null,
        lower: lower,
        snake: snake,
        constant: constant,
        camel: camel,
        kebab: kebab,
        upper: upper,
        capital: capital,
        header: header,
        pascal: pascal,
        title: title,
        sentence: sentence
    });

    const typesArray = Object.keys(types);

    function of(s) {
        for (var i = 0, m = typesArray.length; i < m; i++) {
            if (Case[typesArray[i]].apply(Case, arguments) === s) {
                return typesArray[i];
            }
        }
    }

    function flip(s) {
        return s.replace(/\w/g, function (l) {
            return (l == up.call(l) ? low : up).call(l);
        });
    }

    function random(s) {
        return s.replace(/\w/g, function (l) {
            return (Math.round(Math.random()) ? up : low).call(l);
        });
    }

    function type(type, fn) {
        Case[type] = fn;
        typesArray.push(type);
    }

    const utils = {
        ..._,
        types: typesArray,
    };

    const Case = {
        _:utils,
        of,
        flip,
        random,
        type,
        ...types,
    };

    return Case;

})));
//# sourceMappingURL=Case.js.map
