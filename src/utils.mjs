export function unicodes(s, prefix) {
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

export function regexps(symbols, lowers, uppers, impropers) {
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

export const re = regexps();

export const up = String.prototype.toUpperCase;
export const low = String.prototype.toLowerCase;
export function cap(s) {
    return up.call(s.charAt(0)) + s.slice(1);
}
export function decap(s) {
    return low.call(s.charAt(0)) + s.slice(1);
}
export function deapostrophe(s) {
    return s.replace(re.apostrophe, '');
}
export function fill(s, fill, _deapostrophe) {
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
export function prep(s, _fill, pascal, upper) {
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
export function relax(m, before, acronym, caps) {
    return before + ' ' + (acronym ? acronym + ' ' : '') + caps;
}
