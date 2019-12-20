# formatDate

This JavaScript Universal Module Definition provides the pair of locale-aware date formatting functions <code>formatDate()</code> and <code>formatUTCDate()</code> for use with the <code>Date()</code> object.

## Installing

```sh
npm install @liquidbox/format-date
```

This command installs the package locally.

### Loading

<strong>CommonJS/Node.js module systems</strong>

```js
const { formatDate, formatUTCDate } = require('@liquidbox/format-date');
```

<strong>ES6 module importing</strong>

```ts
import { formatDate, formatUTCDate } from '@liquidbox/format-date';
```

<strong>HTML document embedding</strong>

```html
<script src="/node_modules/@liquidbox/format-date/lib/index.js" />
```

## Description

```ts
function formatDate(locale?: string | string[], format: string, date: Date = new Date()): string
```

Returns a string formatted according to the given format string using the given object <code>date</code> or the current date if no date is given. In other words, <code>date</code> is optional and defaults to the value of <code>new Date()</code>.

```ts
function formatUTCDate(locale?: string | string[], format: string, date: Date = new Date()): string
```

Identical to the <code>formatDate()</code> function except that the time returned is UTC.

## Parameters

* <strong>locale</strong> (optional): A string with a BCP 47 language tag. To use the default locale, omit this argument.
* <strong>format</strong>: The format of the outputted date string. See the formatting options below.

| Format Character | Description | Example Returned Values |
|---|---|---|
| *Day* | ... | ... |
| d | Day of the month, 2 digits with leading zeros | *01* to *31* |
| D | A textual representation of a day, three letters | *Mon* to *Sun* |
| j | Day of the month without leading zeros | *1* to *31* |
| l (lowercase L) | A full textual representation of the day of the week | *Sunday* to *Saturday* |
| N | ISO-8601 numeric representation of the day of the week | *1* (for Monday) to *7* (for Sunday) |
| S | English ordinal suffix for the day of the month, 2 characters | *st*, *nd*, *rd*, or *th* |
| w | Numeric representation of the day of the week | *0* (for Sunday) to *6* (for Saturday) |
| z | The day of the year (starting from 0) | *0* to *365* |
| *Week* | ... | ... |
| W | ISO-8601 week number of year, weeks starting on Monday | e.g.: *42* |
| *Month* | ... | ... |
| F | A full textual representation of a month, such as January or March | *January* to *December* |
| m | Numeric representation of a month, with leading zeros | *01* to *12* |
| M | A short textual representation of a month, three letters | *Jan* to *Dec* |
| n | Numeric representation of a month, without leading zeros | *1* to *12* |
| t | Number of days in the given month | *28* to *31* |
| *Year* | ... | ... |
| L | Whether it's a leap year | *1* if leap year, *0* otherwise |
| o | ISO-8601 week-numbering year. This has the same value as Y, except that if the ISO week number (W) belongs to the previous or next year, that year is used instead. | e.g.: *1999* or *2020* |
| Y | A full numeric representation of a year, 4 digits | e.g.: *1999* or *2020* |
| y | A two digit representation of a year | e.g.: *99* or *20* |
| *Time* | ... | ... |
| a | Lowercase Ante meridiem and Post meridiem | *am* or *pm* |
| A | Uppercase Ante meridiem and Post meridiem | *AM* or *PM* |
| B | Swatch Internet Time (or .beat time) | *000* to *999* |
| g | 12-hour format of an hour without leading zeros | *1* to *12* |
| G | 24-hour format of an hour without leading zeros | *0* to *23* |
| h | 12-hour format of an hour with leading zeros | *01* to *12* |
| H | 24-hour format of an hour with leading zeros | *00* to *23* |
| i | Minutes with leading zeros | *00* to *59* |
| s | Seconds with leading zeros | *00* to *59* |
| v | Milliseconds | e.g.: *321* |
| *Timezone* | ... | ... |
| e | Timezone identifier | e.g.: *UTC*, *America/Toronto*, ... |
| O | Difference to Greenwich time (GMT) without colon between hours and minutes | e.g.: *+0200* |
| P | Difference to Greenwich time (GMT) with colon between hours and minutes | e.g.: *+02:00* |
| T | Timezone abbreviation | e.g.: *EST*, *BST*, ... |
| Z | Timezone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive. | *-43200* to *50400* |
| *Full Date/Time* | ... | ... |
| c | ISO-8601 date | e.g.: *2004-02-12T15:19:21+00:00* |
| r | RFC 2822 formatted date | e.g.: *Thu, 21 Dec 2000 16:01:07 +0200* |
| U | Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT) | |

Unrecognized characters in the format string will be printed as-is. The Z format will always return *0* when using <code>formatUTCDate()</code>.

* <strong>date</strong> (optional): A <code>Date()</code> object, defaults to the value of <code>new Date()</code>.

## Return Values

Returns a formatted date string.

## Usage

<strong>Example #1 Usage examples</strong>

```javascript
// prints something like: Monday
console.log(formatDate('l'));

// prints something like: Monday 8th of August 2005 03:12:46 PM
console.log(formatDate('l jS \\of F Y h:i:s A'));

// prints: July 1, 2000 is on a Saturday
console.log("July 1, 2000 is on a " + formatDate('l', new Date("July 1, 2000")));

/* use variables in the format parameter */
// prints something like: Wednesday, 25-Sep-2013 15:28:57 MST
var cookieFormat = 'D, d-M-Y H:i:s O';
console.log(formatDate(cookieFormat));

// prints: 2000-07-01T00:00:00+00:00
console.log(formatUTCDate('Y-m-d\\TH:i:sP', new Date(Date.UTC(2000, 6, 1))));
```

<strong>Example #2 Escaping characters</strong>

```javascript
/* escape the backslash character */
// prints something like: Friday the 13th
console.log(formatDate('l \\t\\h\\e jS'));
```

Note that you should escape any other characters, as any which currently have a special meaning will produce undesirable results, and other characters may be assigned meaning in future versions.

Some examples of Date formatting.

<strong>Example #3 Formatting</strong>

```javascript
// assuming today is March 10th, 2001, 5:16:18 pm, and that we are in the Mountain Standard Time (MST) Time Zone

today = formatDate('F j, Y, g:i a');                           // March 10, 2001, 5:16 pm
today = formatDate('m.d.y');                                   // 03.10.01
today = formatDate('j, n, Y');                                 // 10, 3, 2001
today = formatDate('Ymd');                                     // 20010310
today = formatDate('h-i-s, j-m-y, it is w Day');               // 05-16-18, 10-03-01, 1631 1618 6 Satpm01
today = formatDate('\\i\\t \\i\\s \\t\\h\\e jS \\d\\a\\y.');   // it is the 10th day.
today = formatDate('D M j G:i:s T Y');                         // Sat Mar 10 17:16:18 MST 2001
today = formatDate('H:m:s \\m \\i\\s\\ \\m\\o\\n\\t\\h');      // 17:03:18 m is month
today = formatDate('H:i:s');                                   // 17:16:18
today = formatDate('Y-m-d H:i:s');                             // 2001-03-10 17:16:18 (the MySQL DATETIME format)
```

To format dates in other languages, set the <code>locale</code> parameter.

<strong>Example #4 Localization</strong>

```javascript
// assuming today is December 25th, 2018, in the Gregorian calendar

christmas = formatDate('ar-AE', 'F j Y');    // ديسمبر ٢٥ ٢٠١٨
christmas = formatDate('zh-Hans', 'F j Y');  // 十二月 25 2018年
christmas = formatDate('th', 'F j Y');       // ธันวาคม 25 พ.ศ. 2561
```
