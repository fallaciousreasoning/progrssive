import { Subscription } from "../model/subscription";
import { makeRequest } from "./common";

const endpoint = '/subscriptions';

export const getSubscriptions = async (): Promise<Subscription[]> => {
    return makeRequest<Subscription[]>(`${endpoint}/`);
}