import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";

let updating = false;
export const updateProfile = async () => {
    if (updating) return;

    updating = true;
    getStore().profile = await getProfile();
    updating = false;
}