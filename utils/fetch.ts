import { fetchSansCors } from "../api/common";

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