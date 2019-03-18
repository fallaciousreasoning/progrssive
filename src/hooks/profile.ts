import { Profile } from "../model/profile";
import { useStore, makeStoreCache } from "./store";
import { executeOnce } from "./promise";
import { getProfile } from "../api/profile";

let fetching = false;

export const useProfileOld = (): Profile => {
    const store = useStore();

    // If we haven't cached the profile, get it from the internet.
    executeOnce(() => {
        if (fetching) return;
        fetching = true;

        return !store.profile && getProfile()
            .then(profile => store.profile = profile)
            .then(() => fetching = false);
    });

    return store.profile;
}

const useProfileCache = makeStoreCache(() => getProfile(), (store, profile) => store.profile = profile);
export const useProfile = (): Profile => {
    return useProfileCache();
}