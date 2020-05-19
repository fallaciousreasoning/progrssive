import { Omit } from "@material-ui/core";
import { Category } from "../model/category";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { Subscription } from "../model/subscription";
import { Collection } from "../model/collection";

export type StoreStream = Omit<Stream, 'items'>
  & {
    lastFetched: number;
    items: string[];
  };

export interface UpdatingInformation {
  categories: boolean;
  [id: string]: boolean;
}

export interface Settings {
  unreadOnly: boolean;
  markOpenedAsRead: boolean;
  markScrolledAsRead: boolean;
  doubleTapToCloseArticles: boolean;
  fontSize: 1 | 2 | 3 | 4 | 5;
  darkMode: boolean;
}

export interface StoreDef {
  updating: UpdatingInformation;
  settings: Settings;
  current: {
    [path: string]: string;
  },

  streams: {
    [id: string]: StoreStream;
  },
  entries: {
    [id: string]: Entry
  },
  subscriptions: Subscription[];
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}