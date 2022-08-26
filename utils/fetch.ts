export const fetchJson = <T>(request: RequestInfo, init?: RequestInit) => fetch(request, init).then(r => r.json()) as Promise<T>;
