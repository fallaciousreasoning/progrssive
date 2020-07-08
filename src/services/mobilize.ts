import { getPageText } from "../utils/fetch"
import { EntryContent } from "../model/entry";

export default async (url: string): Promise<EntryContent> => {
    const text = await getPageText(url);
    if (!text)
        return;

    // Import these libraries on demand. They're big, and we only
    // use them here.
    const [Readability, DOMPurify] = (await Promise.all([
        import("../third_party/Readability"),
        import("dompurify")]))
        .map(i => i.default);
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