/**
 * @author Jonathan-Paul Marois <jonathanpaul.marois@gmail.com>
 */

interface ArgumentsInterface {
    locale?: string;
    format: string;
    date: Date;
}

interface FactoryInterface {
    formatDate: Function;
    formatUTCDate: Function;
}

(function(root: globalThis, factory: Function): void {
    if (typeof define === 'function' && define.amd) define([], factory);
    else if (typeof module === 'object' && module.exports) module.exports = factory();
    else {
        const f: FactoryInterface = factory();
        root.formatDate = f.formatDate;
        root.formatUTCDate = f.formatUTCDate;
    }
})(typeof self !== undefined ? self : this, function(): FactoryInterface {
    const FORMAT_ISO8601: string = 'Y-m-d\\TH:i:sP';
    const FORMAT_RFC2822: string = 'D, d M Y H:i:s.v O';
    const OPTIONS: { useGrouping: boolean; maximumFractionDigits: number } = {
        useGrouping: false,
        maximumFractionDigits: 0
    };

    const getArguments: Function = (a: any[]): ArgumentsInterface => {
        if (!a.length) return { date: new Date(), format: '' };
        if (a.length === 1) return { date: new Date(), format: a[0] };
        if (a.length > 2) return { date: a[2], format: a[1], locale: a[0] };
        if (a[1] instanceof Date) return { date: a[1], format: a[0] };
        return { date: new Date(), format: a[1], locale: a[0] };
    };
    const getBeats: Function = (d: Date): number => Math.floor(((d.getTime() + 36e5) % 864e5) / 86400);
    const getHours: Function = (n: number): number => (n > 12 ? n - 12 : n === 0 ? 12 : n);
    const getMeridiem: Function = (n: number): string => (n > 11 ? 'PM' : 'AM');
    const getOffset: Function = (n: number, b: boolean = false): string =>
        (n > 0 ? '-' : '+') + padString(Math.floor(Math.abs(n) / 60)) + (b ? ':' : '') + padString(Math.abs(n) % 60);
    const getOrdinal: Function = (n: number): string => ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
    const getUnixEpoch: Function = (d: Date): number => Math.floor(d.getTime() / 1e3);
    const getWeek: Function = (d: Date): number => {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        return Math.ceil(((Number(d) - Number(new Date(Date.UTC(d.getUTCFullYear(), 0, 1)))) / 864e5 + 1) / 7);
    };
    const getWeekDay: Function = (n: number): number => (n === 0 ? 7 : n);
    const isLeapYear: Function = (n: number): number => (n % 400 === 0 || (n % 4 === 0 && n % 100 !== 0) ? 1 : 0);
    const padLocaleString: Function = (s: string | string[], n1: number, n2: number = 2): string => {
        const a1: string[] = String(n1).split('');
        let a2: string[] = Array.apply(null, Array(n2)).map((): string => '0');
        a2.unshift('1');
        a2.slice(-a1.length);
        return parseInt(a2.concat(a1).join(''))
            .toLocaleString(s, OPTIONS)
            .slice(-n2);
    };
    const padString: Function = (n1: number, n2: number = 2): string => {
        const a1: string[] = String(n1).split('');
        let a2: string[] = Array.apply(null, Array(n2)).map((): string => '0');
        a2.slice(-a1.length);
        return a2
            .concat(a1)
            .slice(-n2)
            .join('');
    };
    const toFormat: Function = (f: { [c: string]: Function }, a: ArgumentsInterface): string => {
        let b: boolean = false;
        return a.format.replace(/[ABDFGHLMNOPSTUWYZ\\acdeghijlmnrstvwyz]/g, (c: string): string => {
            if (!b) {
                if (c === '\\') {
                    b = !b;
                    return '';
                }
                if (c in f) return f[c](a.date, a.locale);
            } else b = !b;
            return c;
        });
    };

    const formatCharacters: { [c: string]: Function } = {
        A: (d: Date): string => getMeridiem(d.getHours()),
        B: (d: Date, s?: string): string => (s ? padLocaleString(s, getBeats(d), 3) : padString(getBeats(d), 3)),
        D: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { weekday: 'short' }),
        F: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: 'long' }),
        G: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { hour: 'numeric' }),
        H: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getHours()) : padString(d.getHours())),
        L: (d: Date): number => isLeapYear(d.getFullYear()),
        M: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: 'short' }),
        N: (d: Date, s?: string): string => getWeekDay(d.getDay()).toLocaleString(s ? s : undefined, OPTIONS),
        O: (d: Date): string => getOffset(d.getTimezoneOffset()),
        P: (d: Date): string => getOffset(d.getTimezoneOffset(), true),
        S: (d: Date): string => getOrdinal(d.getDate()),
        T: (d: Date): string => d.toLocaleString('en-AU', { timeZoneName: 'long' }).replace(/[^A-Z]/g, ''),
        U: (d: Date, s?: string): string => getUnixEpoch(d).toLocaleString(s ? s : undefined, OPTIONS),
        W: (d: Date, s?: string): string => getWeek(d).toLocaleString(s ? s : undefined, OPTIONS),
        Y: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { year: 'numeric' }),
        Z: (d: Date, s?: string): string => (d.getTimezoneOffset() * 60).toLocaleString(s ? s : undefined, OPTIONS),
        a: (d: Date): string => getMeridiem(d.getHours()).toLowerCase(),
        c: (d: Date, s?: string): string => (s ? formatDate(s, FORMAT_ISO8601, d) : formatDate(FORMAT_ISO8601, d)),
        d: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { day: '2-digit' }),
        e: (d: Date, s?: string): string => Intl.DateTimeFormat(s ? s : undefined, {}).resolvedOptions().timeZone,
        g: (d: Date, s?: string): string => getHours(d.getHours()).toLocaleString(s ? s : undefined, OPTIONS),
        h: (d: Date, s?: string): string =>
            s ? padLocaleString(s, getHours(d.getHours())) : padString(getHours(d.getHours())),
        i: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getMinutes()) : padString(d.getMinutes())),
        j: (d: Date, s?: string): string => d.getDate().toLocaleString(s ? s : undefined, OPTIONS),
        l: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { weekday: 'long' }),
        m: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: '2-digit' }),
        n: (d: Date, s?: string): string => (d.getMonth() + 1).toLocaleString(s ? s : undefined, OPTIONS),
        r: (d: Date, s?: string): string => (s ? formatDate(s, FORMAT_RFC2822, d) : formatDate(FORMAT_RFC2822, d)),
        s: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getSeconds()) : padString(d.getSeconds())),
        t: (d: Date, s?: string): string =>
            new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate().toLocaleString(s ? s : undefined, OPTIONS),
        v: (d: Date, s?: string): string =>
            s ? padLocaleString(s, d.getMilliseconds(), 3) : padString(d.getMilliseconds(), 3),
        w: (d: Date, s?: string): string => d.getDay().toLocaleString(s ? s : undefined, OPTIONS),
        y: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { year: '2-digit' }),
        z: (d: Date, s?: string): string =>
            (Math.ceil((Number(d) - Number(new Date(d.getFullYear(), 0, 1))) / 864e5) - 1).toLocaleString(
                s ? s : undefined,
                OPTIONS
            )
    };
    const formatDate: Function = function(): string {
        return toFormat(formatCharacters, getArguments(arguments));
    };
    const formatUTCCharacters: { [c: string]: Function } = {
        A: (d: Date): string => getMeridiem(d.getUTCHours()),
        B: formatCharacters['B'],
        D: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', weekday: 'short' }),
        F: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: 'long', timeZone: 'UTC' }),
        G: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { hour: 'numeric', timeZone: 'UTC' }),
        H: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getUTCHours()) : padString(d.getUTCHours())),
        L: (d: Date): number => isLeapYear(d.getUTCFullYear()),
        M: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: 'short', timeZone: 'UTC' }),
        N: (d: Date, s?: string): string => getWeekDay(d.getUTCDay()).toLocaleString(s ? s : undefined, OPTIONS),
        O: (): string => '+0000',
        P: (): string => '+00:00',
        S: (d: Date): string => getOrdinal(d.getUTCDate()),
        T: (): string => 'UTC',
        U: formatCharacters['U'],
        W: (d: Date, s?: string): string => getWeek(d).toLocaleString(s ? s : undefined, OPTIONS),
        Y: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', year: 'numeric' }),
        Z: (d: Date, s?: string): string => Number(0).toLocaleString(s ? s : undefined, OPTIONS),
        a: (d: Date): string => getMeridiem(d.getUTCHours()).toLowerCase(),
        c: (d: Date, s?: string): string =>
            s ? formatUTCDate(s, FORMAT_ISO8601, d) : formatUTCDate(FORMAT_ISO8601, d),
        d: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { day: '2-digit', timeZone: 'UTC' }),
        e: (): string => 'UTC',
        g: (d: Date, s?: string): string => getHours(d.getUTCHours()).toLocaleString(s ? s : undefined, OPTIONS),
        h: (d: Date, s?: string): string =>
            s ? padLocaleString(s, getHours(d.getUTCHours())) : padString(getHours(d.getUTCHours())),
        i: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getUTCMinutes()) : padString(d.getUTCMinutes())),
        j: (d: Date, s?: string): string => d.getUTCDate().toLocaleString(s ? s : undefined, OPTIONS),
        l: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', weekday: 'long' }),
        m: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { month: '2-digit', timeZone: 'UTC' }),
        n: (d: Date, s?: string): string => (d.getUTCMonth() + 1).toLocaleString(s ? s : undefined, OPTIONS),
        r: (d: Date, s?: string): string =>
            s ? formatUTCDate(s, FORMAT_RFC2822, d) : formatUTCDate(FORMAT_RFC2822, d),
        s: (d: Date, s?: string): string => (s ? padLocaleString(s, d.getUTCSeconds()) : padString(d.getUTCSeconds())),
        t: (d: Date, s?: string): string =>
            new Date(d.getFullYear(), d.getMonth() + 1, 0).getUTCDate().toLocaleString(s ? s : undefined, OPTIONS),
        v: (d: Date, s?: string): string =>
            s ? padLocaleString(s, d.getUTCMilliseconds(), 3) : padString(d.getUTCMilliseconds(), 3),
        w: (d: Date, s?: string): string => d.getUTCDay().toLocaleString(s ? s : undefined, OPTIONS),
        y: (d: Date, s?: string): string => d.toLocaleString(s ? s : undefined, { timeZone: 'UTC', year: '2-digit' }),
        z: (d: Date): number =>
            Math.ceil((Number(d) - Number(new Date(Date.UTC(d.getUTCFullYear(), 0, 1)))) / 864e5) - 1
    };
    const formatUTCDate: Function = function(): string {
        return toFormat(formatUTCCharacters, getArguments(arguments));
    };

    return { formatDate: formatDate, formatUTCDate: formatUTCDate };
});
