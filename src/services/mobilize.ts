import { getPageText } from "../utils/fetch"
import Readability from '../third_party/Readability';

export default async (url: string) => {
    const text = await getPageText(url);
    if (!text)
        return;

    const document = new DOMParser()
        .parseFromString(text, 'text/html');

    const readable = await new Readability(document)
        .parse();
    return readable.content;
}