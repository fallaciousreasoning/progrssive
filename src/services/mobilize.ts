import { getPageText } from "../utils/fetch"
import DOMPurify from 'dompurify';
import { EntryContent } from "../model/entry";

export default async (url: string): Promise<EntryContent> => {
    const text = await getPageText(url);
    if (!text)
        return;

    // Import Readability on demand, it's a big library.
    const Readability = await (await import("../third_party/Readability")).default;

    const document = new DOMParser()
        .parseFromString(text, 'text/html');

    const readable = new Readability(document)
        .parse();

    const content = DOMPurify.sanitize(readable.content);
    return {
        content,
        direction: readable.dir
    };
}