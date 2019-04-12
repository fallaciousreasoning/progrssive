import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";
import { save } from "../services/persister";

export const updateProfile = async () => {
    if (getStore().updating.profile) return;

    getStore().updating.profile = true;
    getStore().profile = await getProfile();
    getStore().updating.profile = false;

    save('profile', getStore().profile);
}