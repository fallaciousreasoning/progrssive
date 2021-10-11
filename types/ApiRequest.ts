import { NextApiRequest } from "next";

export type ApiRequest<T={}> = NextApiRequest & {
    query: T;
}