import { useRouter } from "next/router"

export const useStreamId = () => {
    const router = useRouter();
    const query = router.query;

    const streamId = Array.isArray(query.streamId) ? query.streamId[0] : query.streamId;
    return streamId === "all" ? undefined : streamId;
}

export const useEntryId = () => {
    const router = useRouter();
    const query = router.query;

    return Array.isArray(query.entryId) ? query.entryId[0] : query.entryId;
}