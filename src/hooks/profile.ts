import { Profile } from "../model/profile";
import { useStore, makeStoreCache } from "./store";
import { executeOnce } from "./promise";
import { getProfile } from "../api/profile";
import { useEffect } from "react";
import { updateProfile } from "../actions/profile";

export const useProfile = (): Profile => {
    const store = useStore();

    useEffect(() => {
        if (store.profile) return;
        updateProfile();
    }, []);

    return store.profile;
}