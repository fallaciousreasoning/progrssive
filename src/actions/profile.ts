import { Store } from "react-recollect";
import { getProfile } from "../api/profile";
import { getStore } from "../hooks/store";

export const updateProfile = async () => {
    getStore().profile = await getProfile();
}