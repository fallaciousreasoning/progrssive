import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";
import { save, load } from "../services/persister";

export const updateProfile = async (force: boolean = false) => {
    if (getStore().updating.profile) return;

    getStore().updating.profile = true;

    // If we aren't forcing the load, try and load the profile from disk.
    if (!force)
        getStore().profile = await load('profile');

    // If the load failed, load the profile from the network and save to disk.
    if (!getStore().profile) {
        getStore().profile = await getProfile();
        await save('profile', getStore().profile);
    }

    getStore().updating.profile = false;
}