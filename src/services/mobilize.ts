import { EntryContent } from "../model/entry";

const MOBILIZER_URL = `https://mobilize.now.sh/api/mobilize/`

export default async (url: string): Promise<EntryContent> => {
    const response = await fetch(`${MOBILIZER_URL}${encodeURIComponent(url)}`);
    return await response.json();
}