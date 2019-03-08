import { Omit } from "@material-ui/core";
import { Category } from "../model/category";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { Subscription } from "../model/subscription";

type StoreStream = Omit<Stream, 'items'>
  & {
    items: string[];
  };

type StoreCategory = Category & {
  subscriptions: Set<string>;
}

export interface StoreDef {
  profile: {},
  streams: {
    [id: string]: StoreStream;
  },
  entries: {
    [id: string]: Entry
  },
  subscriptions: {
    [id: string]: Subscription;
  }
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}