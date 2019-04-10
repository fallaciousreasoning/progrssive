import { Store } from "react-recollect";
import { getStore } from "../hooks/store";
import { getAllId, getStream } from "../api/streams";
import { updateProfile } from "./profile";
import { setAllStreams } from "../services/store";

export const updatingStream = (streamId: string) => getStore().updating.streams[streamId];
export const updateStreams = async (streamId?: string, unreadOnly: boolean = false) => {
    if (!getStore().profile)
        await updateProfile();

    streamId = streamId || getAllId(getStore().profile.id);
    if (updatingStream(streamId)) return;
    getStore().updating.streams[streamId] = true;

    const stream = await getStream(streamId, 'contents', { unreadOnly });

    // TODO: We should have a better set all streams method.
    setAllStreams(getStore().profile.id, stream);
    getStore().updating.streams[streamId] = false;
}