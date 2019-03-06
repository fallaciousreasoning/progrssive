import { Omit } from "@material-ui/core";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";

type StoreStream = Omit<Stream, 'items'>
  & {
    items: string[];
  };

export interface StoreDef {
  profile: {},
  streams: {
    [id: string]: StoreStream;
  },
  entries: {
    [id: string]: Entry
  }
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}