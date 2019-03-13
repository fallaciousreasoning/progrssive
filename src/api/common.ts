import queryString from "querystring";
import feedlyConfig from '../feedly.json';

const bypassCorsUrl = 'https://cors-anywhere.herokuapp.com/';

export const feedlyQueryString = (params: Object): string => {
    const fixedCase = {};
    for (const key in params || {}) {
        fixedCase[key] = params[key];
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

    const requestUrl = `${feedlyConfig.feedlyUrl}${url}${joiner}${queryString}`;

    // TODO: Use a custom cors proxy, this should not be in production.
    const response = await fetch(`${bypassCorsUrl}${requestUrl}`, {
        method: 'GET',
            headers: {
                'Authorization': `OAuth ${feedlyConfig.accessToken}`
            }
    });
    return response.json();
}