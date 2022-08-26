export const getPageText = async (url: string) => {
    let response: Response;
    try {
        response = await fetch(url, {
            credentials: 'omit'
        });
    } catch {
        // This probably means cors to the site was blocked.
        // Try again, going through our proxy.
        response = await fetchSansCors(url);
    }

    return response.text();
}

export const bypassCorsUrl = 'https://progrssive-cors.herokuapp.com/';

export const fetchSansCors = (url: string, init?: RequestInit) => {
    url = `${bypassCorsUrl}${url}`
    return fetch(url, init);
}

export const fetchJson = <T>(request: RequestInfo, init?: RequestInit) => fetch(request, init).then(r => r.json()) as Promise<T>;
