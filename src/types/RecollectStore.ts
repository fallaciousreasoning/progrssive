import { Entry } from "../model/entry";
import { Subscription } from "../model/subscription";
import { AccentColor } from "../theme";

export interface UpdatingInformation {
  categories: boolean;
  stream: {
    all?: Promise<void>;
    [streamId: string]: Promise<void>;
  };
}

export interface Settings {
  markOpenedAsRead: boolean;
  markScrolledAsRead: boolean;
  doubleTapToCloseArticles: boolean;
  fontSize: 1 | 2 | 3 | 4 | 5;
  theme: 'light' | 'dark' | 'device';
  accent: AccentColor;
  secondaryAccent: AccentColor;
  fontFamily: 'Roboto';
}

export interface StoreStream {
  id: string;
  unreadOnly: boolean;
  lastScrollPos: number;
  length: number;
  loadedEntries: string[];
}

export interface StoreDef {
  updating: UpdatingInformation;
  settings: Settings;
  current: {
    [path: string]: string;
  },
  subscriptions: Subscription[];
  lastUpdate: number;

  stream: StoreStream;
  entries: { [id: string]: Entry };
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}