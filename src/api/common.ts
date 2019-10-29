import queryString from "querystring";
import feedlyConfig from '../feedly.json';
import auth from '../services/auth';

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
            'Authorization': `OAuth ${(await auth.accessTokenPromise).access_token}`
        }
    });

    // Make sure error handling is triggered if the response status is not ok.
    if (!response.ok)
        throw response;

    return response.json();
}

export const makePostRequest = async (endpoint: string, params: Object) => {
    return fetch(`${bypassCorsUrl}${feedlyConfig.feedlyUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `OAuth ${(await auth.accessTokenPromise).access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
}

export async function makeNoAuthPostRequest<T>(url: string, params: Object) {
    const response = await fetch(`${bypassCorsUrl}${feedlyConfig.feedlyUrl}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    }); 

    return response.json() as Promise<T>;
}