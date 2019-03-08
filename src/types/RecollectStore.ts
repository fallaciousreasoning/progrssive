import { Omit } from "@material-ui/core";
import { Category } from "../model/category";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";
import { Subscription } from "../model/subscription";
import { Profile } from "../model/profile";
import { Collection } from "../model/collection";

type StoreStream = Omit<Stream, 'items'>
  & {
    items: string[];
  };

export interface StoreDef {
  streams: {
    [id: string]: StoreStream;
  },
  entries: {
    [id: string]: Entry
  },
  collections: Collection[],
  profile: Profile
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}