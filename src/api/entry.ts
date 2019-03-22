import { makeRequest } from "./common";
import { Entry } from "../model/entry";

export const getEntry = async (entryId: string) => {
    const entries = await makeRequest<Entry[]>(`/entries/${entryId}`);
    return entries[0];
}