import { Entry } from "./entry";
import { Link } from "./link";

export interface Stream {
    id: string;
    title?: string;
    direction?: 'ltr' | 'rtl';
    continuation?: string;
    self?: Link[];
    alternate?: Link[];
    updated?: number;
    items: Entry[];
}