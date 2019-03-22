import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";

export const updateProfile = async () => {
    if (getStore().updating.profile) return;

    getStore().updating.profile = true;
    getStore().profile = await getProfile();
    getStore().updating.profile = false;
}