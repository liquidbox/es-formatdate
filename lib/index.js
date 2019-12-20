"use strict";
/**
 * @author Jonathan-Paul Marois <jonathanpaul.marois@gmail.com>
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd)
        define([], factory);
    else if (typeof module === 'object' && module.exports)
        module.exports = factory();
    else {
        var f = factory();
        root.formatDate = f.formatDate;
        root.formatUTCDate = f.formatUTCDate;
    }
})(typeof self !== undefined ? self : this, function () {
    var FORMAT_ISO8601 = 'Y-m-d\\TH:i:sP';
    var FORMAT_RFC2822 = 'D, d M Y H:i:s.v O';
    var OPTIONS = {
        useGrouping: false,
        maximumFractionDigits: 0
    };
    var getArguments = function (a) {
        if (!a.length)
            return { date: new Date(), format: '' };
        if (a.length === 1)
            return { date: new Date(), format: a[0] };
        if (a.length > 2)
            return { date: a[2], format: a[1], locale: a[0] };
        if (a[1] instanceof Date)
            return { date: a[1], format: a[0] };
        return { date: new Date(), format: a[1], locale: a[0] };
    };
    var getBeats = function (d) { return Math.floor(((d.getTime() + 36e5) % 864e5) / 86400); };
    var getHours = function (n) { return (n > 12 ? n - 12 : n === 0 ? 12 : n); };
    var getMeridiem = function (n) { return (n > 11 ? 'PM' : 'AM'); };
    var getOffset = function (n, b) {
        if (b === void 0) { b = false; }
        return (n > 0 ? '-' : '+') + padString(Math.floor(Math.abs(n) / 60)) + (b ? ':' : '') + padString(Math.abs(n) % 60);
    };
    var getOrdinal = function (n) { return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th'; };
    var getUnixEpoch = function (d) { return Math.floor(d.getTime() / 1e3); };
    var getWeek = function (d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        return Math.ceil(((Number(d) - Number(new Date(Date.UTC(d.getUTCFullYear(), 0, 1)))) / 864e5 + 1) / 7);
    };
    var getWeekDay = function (n) { return (n === 0 ? 7 : n); };
    var isLeapYear = function (n) { return (n % 400 === 0 || (n % 4 === 0 && n % 100 !== 0) ? 1 : 0); };
    var padLocaleString = function (s, n1, n2) {
        if (n2 === void 0) { n2 = 2; }
        var a1 = String(n1).split('');
        var a2 = Array.apply(null, Array(n2)).map(function () { return '0'; });
        a2.unshift('1');
        a2.slice(-a1.length);
        return parseInt(a2.concat(a1).join(''))
            .toLocaleString(s, OPTIONS)
            .slice(-n2);
    };
    var padString = function (n1, n2) {
        if (n2 === void 0) { n2 = 2; }
        var a1 = String(n1).split('');
        var a2 = Array.apply(null, Array(n2)).map(function () { return '0'; });
        a2.slice(-a1.length);
        return a2
            .concat(a1)
            .slice(-n2)
            .join('');
    };
    var toFormat = function (f, a) {
        var b = false;
        return a.format.replace(/[ABDFGHLMNOPSTUWYZ\\acdeghijlmnrstvwyz]/g, function (c) {
            if (!b) {
                if (c === '\\') {
                    b = !b;
                    return '';
                }
                if (c in f)
                    return f[c](a.date, a.locale);
            }
            else
                b = !b;
            return c;
        });
    };
    var formatCharacters = {
        A: function (d) { return getMeridiem(d.getHours()); },
        B: function (d, s) { return (s ? padLocaleString(s, getBeats(d), 3) : padString(getBeats(d), 3)); },
        D: function (d, s) { return d.toLocaleString(s ? s : undefined, { weekday: 'short' }); },
        F: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: 'long' }); },
        G: function (d, s) { return d.toLocaleString(s ? s : undefined, { hour: 'numeric' }); },
        H: function (d, s) { return (s ? padLocaleString(s, d.getHours()) : padString(d.getHours())); },
        L: function (d) { return isLeapYear(d.getFullYear()); },
        M: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: 'short' }); },
        N: function (d, s) { return getWeekDay(d.getDay()).toLocaleString(s ? s : undefined, OPTIONS); },
        O: function (d) { return getOffset(d.getTimezoneOffset()); },
        P: function (d) { return getOffset(d.getTimezoneOffset(), true); },
        S: function (d) { return getOrdinal(d.getDate()); },
        T: function (d) { return d.toLocaleString('en-AU', { timeZoneName: 'long' }).replace(/[^A-Z]/g, ''); },
        U: function (d, s) { return getUnixEpoch(d).toLocaleString(s ? s : undefined, OPTIONS); },
        W: function (d, s) { return getWeek(d).toLocaleString(s ? s : undefined, OPTIONS); },
        Y: function (d, s) { return d.toLocaleString(s ? s : undefined, { year: 'numeric' }); },
        Z: function (d, s) { return (d.getTimezoneOffset() * 60).toLocaleString(s ? s : undefined, OPTIONS); },
        a: function (d) { return getMeridiem(d.getHours()).toLowerCase(); },
        c: function (d, s) { return (s ? formatDate(s, FORMAT_ISO8601, d) : formatDate(FORMAT_ISO8601, d)); },
        d: function (d, s) { return d.toLocaleString(s ? s : undefined, { day: '2-digit' }); },
        e: function (d, s) { return Intl.DateTimeFormat(s ? s : undefined, {}).resolvedOptions().timeZone; },
        g: function (d, s) { return getHours(d.getHours()).toLocaleString(s ? s : undefined, OPTIONS); },
        h: function (d, s) {
            return s ? padLocaleString(s, getHours(d.getHours())) : padString(getHours(d.getHours()));
        },
        i: function (d, s) { return (s ? padLocaleString(s, d.getMinutes()) : padString(d.getMinutes())); },
        j: function (d, s) { return d.getDate().toLocaleString(s ? s : undefined, OPTIONS); },
        l: function (d, s) { return d.toLocaleString(s ? s : undefined, { weekday: 'long' }); },
        m: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: '2-digit' }); },
        n: function (d, s) { return (d.getMonth() + 1).toLocaleString(s ? s : undefined, OPTIONS); },
        r: function (d, s) { return (s ? formatDate(s, FORMAT_RFC2822, d) : formatDate(FORMAT_RFC2822, d)); },
        s: function (d, s) { return (s ? padLocaleString(s, d.getSeconds()) : padString(d.getSeconds())); },
        t: function (d, s) {
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate().toLocaleString(s ? s : undefined, OPTIONS);
        },
        v: function (d, s) {
            return s ? padLocaleString(s, d.getMilliseconds(), 3) : padString(d.getMilliseconds(), 3);
        },
        w: function (d, s) { return d.getDay().toLocaleString(s ? s : undefined, OPTIONS); },
        y: function (d, s) { return d.toLocaleString(s ? s : undefined, { year: '2-digit' }); },
        z: function (d, s) {
            return (Math.ceil((Number(d) - Number(new Date(d.getFullYear(), 0, 1))) / 864e5) - 1).toLocaleString(s ? s : undefined, OPTIONS);
        }
    };
    var formatDate = function () {
        return toFormat(formatCharacters, getArguments(arguments));
    };
    var formatUTCCharacters = {
        A: function (d) { return getMeridiem(d.getUTCHours()); },
        B: formatCharacters['B'],
        D: function (d, s) { return d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', weekday: 'short' }); },
        F: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: 'long', timeZone: 'UTC' }); },
        G: function (d, s) { return d.toLocaleString(s ? s : undefined, { hour: 'numeric', timeZone: 'UTC' }); },
        H: function (d, s) { return (s ? padLocaleString(s, d.getUTCHours()) : padString(d.getUTCHours())); },
        L: function (d) { return isLeapYear(d.getUTCFullYear()); },
        M: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: 'short', timeZone: 'UTC' }); },
        N: function (d, s) { return getWeekDay(d.getUTCDay()).toLocaleString(s ? s : undefined, OPTIONS); },
        O: function () { return '+0000'; },
        P: function () { return '+00:00'; },
        S: function (d) { return getOrdinal(d.getUTCDate()); },
        T: function () { return 'UTC'; },
        U: formatCharacters['U'],
        W: function (d, s) { return getWeek(d).toLocaleString(s ? s : undefined, OPTIONS); },
        Y: function (d, s) { return d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', year: 'numeric' }); },
        Z: function (d, s) { return Number(0).toLocaleString(s ? s : undefined, OPTIONS); },
        a: function (d) { return getMeridiem(d.getUTCHours()).toLowerCase(); },
        c: function (d, s) {
            return s ? formatUTCDate(s, FORMAT_ISO8601, d) : formatUTCDate(FORMAT_ISO8601, d);
        },
        d: function (d, s) { return d.toLocaleString(s ? s : undefined, { day: '2-digit', timeZone: 'UTC' }); },
        e: function () { return 'UTC'; },
        g: function (d, s) { return getHours(d.getUTCHours()).toLocaleString(s ? s : undefined, OPTIONS); },
        h: function (d, s) {
            return s ? padLocaleString(s, getHours(d.getUTCHours())) : padString(getHours(d.getUTCHours()));
        },
        i: function (d, s) { return (s ? padLocaleString(s, d.getUTCMinutes()) : padString(d.getUTCMinutes())); },
        j: function (d, s) { return d.getUTCDate().toLocaleString(s ? s : undefined, OPTIONS); },
        l: function (d, s) { return d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', weekday: 'long' }); },
        m: function (d, s) { return d.toLocaleString(s ? s : undefined, { month: '2-digit', timeZone: 'UTC' }); },
        n: function (d, s) { return (d.getUTCMonth() + 1).toLocaleString(s ? s : undefined, OPTIONS); },
        r: function (d, s) {
            return s ? formatUTCDate(s, FORMAT_RFC2822, d) : formatUTCDate(FORMAT_RFC2822, d);
        },
        s: function (d, s) { return (s ? padLocaleString(s, d.getUTCSeconds()) : padString(d.getUTCSeconds())); },
        t: function (d, s) {
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getUTCDate().toLocaleString(s ? s : undefined, OPTIONS);
        },
        v: function (d, s) {
            return s ? padLocaleString(s, d.getUTCMilliseconds(), 3) : padString(d.getUTCMilliseconds(), 3);
        },
        w: function (d, s) { return d.getUTCDay().toLocaleString(s ? s : undefined, OPTIONS); },
        y: function (d, s) { return d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', year: '2-digit' }); },
        z: function (d) {
            return Math.ceil((Number(d) - Number(new Date(Date.UTC(d.getUTCFullYear(), 0, 1)))) / 864e5) - 1;
        }
    };
    var formatUTCDate = function () {
        return toFormat(formatUTCCharacters, getArguments(arguments));
    };
    return { formatDate: formatDate, formatUTCDate: formatUTCDate };
});
//# sourceMappingURL=index.js.map