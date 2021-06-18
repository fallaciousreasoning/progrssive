import { Store } from "react-recollect";
import { Entry } from "../model/entry";
import { Subscription } from "../model/subscription";
import { AccentColor } from "../styles/theme";

export interface CollectProps {
  store: Store;
}
export interface UpdatingInformation {
  categories: boolean;
  stream: {
    [streamId: string]: Promise<void>;
  };
}

export interface CleanupSettings {
    deleteReadEntries: 'never' | 1 | 3 | 7 | 14 | 21 | 28;
    deleteUnreadEntries: 'never' | 1 | 3 | 7 | 14 | 21 | 28;
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
  cleanupSettings: CleanupSettings;
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

  stream: StoreStream;
  entries: { [id: string]: Entry };
}

declare module 'react-recollect' {
  interface Store extends StoreDef { }
}