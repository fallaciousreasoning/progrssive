import { getPageText } from "../utils/fetch"
import Readability from '../third_party/Readability';
import DOMPurify from 'dompurify';
import { EntryContent } from "../model/entry";

export default async (url: string): Promise<EntryContent> => {
    const text = await getPageText(url);
    if (!text)
        return;

    const document = new DOMParser()
        .parseFromString(text, 'text/html');

    const readable = await new Readability(document)
        .parse();

    const content = DOMPurify.sanitize(readable.content);
    return {
        content,
        direction: readable.dir
    };
}