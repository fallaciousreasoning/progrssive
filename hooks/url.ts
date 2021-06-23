import { useRouter } from "next/router"
import { useCallback } from "react";

export const useStreamId = () => {
    const router = useRouter();
    const query = router.query;

    const streamId = Array.isArray(query.streamId) ? query.streamId[0] : query.streamId;
    return streamId === "all" ? undefined : streamId;
}

export const useQuery = () => {
    const router = useRouter();

    const query = new URLSearchParams(globalThis.location?.search);
    const setQuery = useCallback((query: string) => {
        router.replace(new URL(`?${query}`, globalThis.location.href));
    }, [router]);

    return {
        query,
        setQuery
    }
}

export const useShowRead = () => {
    const router = useRouter();
    const { query, setQuery } = useQuery();

    const showRead = query.has('showRead')
        && query.get('showRead') !== "false";

    const setShowRead = useCallback((show: boolean) => {
        if (show) query.set('showRead', '');
        else query.delete('showRead');

        setQuery(query.toString());
    }, [query]);

    return {
        showRead,
        setShowRead
    }
}

export const useEntryId = () => {
    const router = useRouter();
    const query = router.query;

    return Array.isArray(query.entryId) ? query.entryId[0] : query.entryId;
}