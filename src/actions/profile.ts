import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";
import { save, load } from "../services/persister";
import { Profile } from "../model/profile";

let profilePromise: Promise<Profile>;

export const updateProfile = async (force: boolean = false) => {
    if (getStore().updating.profile) return;

    profilePromise = loadProfile(force);

    getStore().updating.profile = true;
    getStore().profile = await profilePromise;
    getStore().updating.profile = false;
}

export const loadProfile = async (force: boolean = false) => {
    if (!force && profilePromise)
      return profilePromise;

    profilePromise = getLoadProfilePromise(force);
    return profilePromise;
}

const getLoadProfilePromise = async (force: boolean) => {
    let profile: Profile;
    // If we aren't forcing the load, try and load the profile from disk.
    if (!force)
         profile = await load('profile');

    // If the load failed, load the profile from the network and save to disk.
    if (!profile) {
        profile = await getProfile();
        await save('profile', profile);
    }

    return profile;
}