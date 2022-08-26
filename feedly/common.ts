import queryString from "querystring";

const feedlyUrl = "https://cloud.feedly.com/v3/"

export const feedlyQueryString = (params: Object): string => {
    const fixedCase = {};
    for (const key in params || {}) {
        fixedCase[key] = params[key];
    }

    return queryString.stringify(fixedCase);
}

export const makeFeedlyRequest = async <T>(url: string, params?: Object): Promise<T> => {
    const queryString = feedlyQueryString(params);
    const joiner = queryString.length === 0
        ? ''
        : url.includes('?')
            ? '&'
            : '?';

    const requestUrl = `${feedlyUrl}${url}${joiner}${queryString}`;

    // TODO: Use a custom cors proxy, this should not be in production.
    const response = await fetch(requestUrl, {
        method: 'GET'
    });

    // Make sure error handling is triggered if the response status is not ok.
    if (!response.ok)
        throw response;

    return response.json();
}

export const makePostRequest = (endpoint: string, params: Object) => {
    return fetch(`${feedlyUrl}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
}

