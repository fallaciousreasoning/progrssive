import { Store } from "react-recollect";
import { getStore } from "../hooks/store";
import { getAllId, getStream, StreamRequestOptions } from "../api/streams";
import { updateProfile, loadProfile } from "./profile";
import { setAllStreams } from "../services/store";

export const updateStreams = async (streamId?: string, unreadOnly: boolean = false, thenSync: boolean = false) => {
    if (!getStore().profile)
        await updateProfile();

    streamId = streamId || getAllId(getStore().profile.id);
    if (getStore().updating[streamId]) return;
    getStore().updating[streamId] = true;

    try {
        const stream = await getStream(streamId, 'contents', { unreadOnly });

        // TODO: We should have a better set all streams method.
        setAllStreams(getStore().profile.id, stream);

        // Maybe update all streams in the background.
        if (thenSync)
            getAllUnread();
    } catch (error) {
        window.snackHelper.enqueueSnackbar("Unable to update stream. You appear to be offline.")
    }
    getStore().updating[streamId] = false;
}

export const getAllUnread = async (continuation: string = undefined) => {
    const profile = await loadProfile();
    const streamId = getAllId(profile.id);

    try {
        do {
            const options: StreamRequestOptions = {
                unreadOnly: true
            };
            if (continuation)
                options.continuation = continuation;

            const stream = await getStream(streamId, 'contents', options);

            // Next time, start from here.
            continuation = stream.continuation;
            setAllStreams(profile.id, stream);
        } while (continuation);
    } catch (error) {
        window.snackHelper.enqueueSnackbar('Background update failed.');
    }

    window.snackHelper.enqueueSnackbar('Background sync complete.');
}