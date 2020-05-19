import { Category } from "./category";

export interface Subscription {
    id: string;
    title: string;
    categories: Category[];
    added?: number;
    updated?: number;
    website?: string;
    visualUrl?: string;
}