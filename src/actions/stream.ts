import { Store } from "react-recollect";
import { getStore } from "../hooks/store";
import { getAllId, getStream } from "../api/streams";
import { updateProfile } from "./profile";
import { setAllStreams } from "../services/store";

export const updateStreams = async (streamId?: string, unreadOnly: boolean = false) => {
    if (!getStore().profile)
        await updateProfile();

    streamId = streamId || getAllId(getStore().profile.id);
    if (getStore().updating[streamId]) return;
    getStore().updating[streamId] = true;

    try {
        const stream = await getStream(streamId, 'contents', { unreadOnly });

        // TODO: We should have a better set all streams method.
        setAllStreams(getStore().profile.id, stream);
    } catch (error) {
        window.snackHelper.enqueueSnackbar("Unable to update stream. You appear to be offline.")
    }
    getStore().updating[streamId] = false;
}