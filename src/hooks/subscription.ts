import { useEffect, useState } from "react";
import { getSubscriptions } from "../api/subscription";
import { Category } from "../model/category";
import { Subscription } from "../model/subscription";
import { updateSubscriptions } from "../services/store";
import { useStore } from "./store";

export const useSubscriptions = (): Subscription[] => {
    const store = useStore();
    const [requested, setRequested] = useState(false);

    // If we haven't cached the subscriptions, get them from the internet.
    useEffect(() => {
        if (store.subscriptions || requested) return;
        setRequested(true);
        getSubscriptions().then(updateSubscriptions);
    });

    return store.subscriptions
        ? Object.values(store.subscriptions)
        : [];
}

type CategorizedSubscriptions = Category & { subscriptions: Subscription[] };

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