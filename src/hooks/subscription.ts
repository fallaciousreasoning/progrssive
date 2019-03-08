import { useEffect, useState } from "react";
import { getSubscriptions } from "../api/subscription";
import { Category } from "../model/category";
import { Subscription } from "../model/subscription";
import { updateSubscriptions } from "../services/store";
import { useStore } from "./store";
import { executeOnce } from "./promise";

export const useSubscriptions = (): Subscription[] => {
    const store = useStore();

    // If we haven't cached the subscriptions, get them from the internet.
    if (!store.subscriptions) {
        executeOnce(() => getSubscriptions().then(updateSubscriptions));
    }

    return store.subscriptions
        ? Object.values(store.subscriptions)
        : [];
}

export type CategorizedSubscriptions = Category & { subscriptions: Subscription[] };

export const useCategories = (): CategorizedSubscriptions[] => {
    console.log("Categoies")
    const subscriptions = useSubscriptions();

    if (!subscriptions) return [];

    const categories: { [id: string]: CategorizedSubscriptions } = {};

    subscriptions.forEach(subscription => {
        subscription.categories.forEach(category => {
            if (!categories[category.id]) {
                categories[category.id] = { 
                    ...category,
                    subscriptions: []
                };
            }

            categories[category.id].subscriptions.push(subscription);
        });
    });

    return Object.values(categories);
}