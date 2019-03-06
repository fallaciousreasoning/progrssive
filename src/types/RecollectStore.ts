import { Omit } from "@material-ui/core";
import { Entry } from "../model/entry";
import { Stream } from "../model/stream";


declare module 'react-recollect' {
  type StoreStream = Omit<Stream, 'items'>
    & {
      items: string[];
    };

  interface Store {
    profile: {},
    categories: {
      [id: string]: StoreStream;
    },
    entries: {
      [id: string]: Entry
    }
  }
}