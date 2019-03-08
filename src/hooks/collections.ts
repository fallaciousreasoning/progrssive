import { useEffect, useState } from "react";
import { getSubscriptions } from "../api/subscription";
import { Category } from "../model/category";
import { Subscription } from "../model/subscription";
import { useStore } from "./store";
import { executeOnce } from "./promise";
import { Collection } from "../model/collection";
import { getCollections } from "../api/collections";

export const useCollections = (): Collection[] => {
    const store = useStore();

    // If we haven't cached the collections, get them from the internet.
    executeOnce(() => !store.collections && getCollections().then(collections => store.collections = collections));

    return store.collections
        ? Object.values(store.collections)
        : [];
}