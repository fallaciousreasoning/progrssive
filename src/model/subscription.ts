import { Category } from "./category";

export interface Subscription {
    id: string;
    title: string;
    categories: Category[];
    sortId: string;
    added: number;
    updated: number;
    website: string;
    visualUrl?: string;
}