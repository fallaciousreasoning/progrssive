import { getStore } from "../hooks/store";
import { updateProfile } from "./profile";
import { getEntry } from "../api/entry";
import { load, save } from "../services/persister";
import { getCollections } from "../api/collections";

const updatingName = 'collections';
export const updateCollections = async () => {
    if (getStore().updating[updatingName]) return;

    getStore().updating[updatingName] = true;

    // Only fetch once per session.
    const shouldFetch = !getStore().collections;

    let collections = await load('collections');
    getStore().collections = collections;

    // Update from network.
    if (shouldFetch) {
        try {
            let newCollections = await getCollections();
            getStore().collections = newCollections;

            await save('collections', newCollections)
        } catch {
            window.snackHelper.enqueueSnackbar('Unable to fetch collections. You appear to be offline.');
        }
    }

    delete getStore().updating[updatingName];
}