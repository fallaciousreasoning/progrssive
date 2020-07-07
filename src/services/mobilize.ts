import { getPageText } from "../utils/fetch"

export default async (url: string) => {
    const text = await getPageText(url);
    const document = new DOMParser().parseFromString(text, 'text/html');
    window['article'] = document;
    document.querySelectorAll('script').forEach(n => n.remove());
    document.querySelectorAll('style').forEach(n => n.remove());

    let articleHtml = document.body.innerHTML;
    const node = document.querySelector('article');
    if (node) {
        articleHtml = node.innerHTML;
    }
    return {
        content: articleHtml,
        title: document.title
    };
}