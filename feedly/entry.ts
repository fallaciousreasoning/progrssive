import { fetchJson } from "utils/fetch";

export const getEntry = async (entryId: string) => fetchJson(`/api/entries/${entryId}`)
