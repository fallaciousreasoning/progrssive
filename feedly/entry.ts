import { makeFeedlyRequest } from "./common";
import { Entry } from "../model/entry";

export const getEntry = async (entryId: string) => {
    const entries = await makeFeedlyRequest<Entry[]>(`entries/${encodeURIComponent(entryId)}`);
    return entries[0];
}