import { Profile } from "../model/profile";
import { useStore } from "./store";
import { executeOnce } from "./promise";
import { getProfile } from "../api/profile";

export const useProfile = (): Profile => {
    const store = useStore();

    // If we haven't cached the profile, get it from the internet.
    executeOnce(() => !store.profile && getProfile().then(profile => store.profile = profile));

    return store.profile;
}