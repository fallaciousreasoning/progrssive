import { makeRequest } from "./common";
import { Entry } from "../model/entry";

export const getEntry = (entryId: string) => {
    return makeRequest<Entry>(`entries/${entryId}`);
}