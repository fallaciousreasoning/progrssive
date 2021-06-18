export const copy = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
window['copy'] = copy;