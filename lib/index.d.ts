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
