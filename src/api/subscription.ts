import { Subscription } from "../model/subscription";
import { makeRequest } from "./common";

const endpoint = '/subscriptions';

export const getStream = async (): Promise<Subscription[]> => {
    return makeRequest<Subscription[]>(`${endpoint}/`);
}