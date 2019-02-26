import snakeCase  from "snake-case"
import queryString from "querystring"
import feedlyConfig from '../../feedly.json'

export const feedlyQueryString = (params: Object): string => {
    const fixedCase = {};
    for (const key in params || {}) {
        fixedCase[snakeCase(key)] = params[key];
    }

    return queryString.stringify(fixedCase);
}

export const makeRequest = async <T>(url: string, params?: Object): Promise<T> => {
    const queryString = feedlyQueryString(params);
    const joiner = queryString.length === 0
        ? ''
        : url.includes('?')
            ? '&'
            : '?';
    
    const response = await fetch(`${feedlyConfig.feedlyUrl}${url}${joiner}${queryString}`);
    return response.json();
}