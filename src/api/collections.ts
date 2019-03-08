import { Collection } from "../model/collection";
import { makeRequest } from "./common";

const endpoint = '/collections';

export const getCollections = async (): Promise<Collection[]> => {
    return makeRequest<Collection[]>(`${endpoint}/`);
}