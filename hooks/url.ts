import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react";
import { capitalize } from 'utils/string';
import { compileFunction } from "vm";

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

export const useQueryParam = <T extends string>(param: T) => {
    const { query, setQuery } = useQuery();
    const setter = useCallback((value: string | null) => {
        const copy = new URLSearchParams(query);
        if (value === undefined || value === null) copy.delete(param);
        else copy.set(param, value);

        setQuery(copy.toString());
    }, [query]);

    return {
        [param]: query.get(param),
        [`set${capitalize(param)}`]: setter
    } as {
        [P in `set${Capitalize<T>}`]: (value?: string | null) => void;
    } & { [P in T]?: string | null };
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

    const inQuery = Array.isArray(query.entryId) ? query.entryId[0] : query.entryId;
    const [cachedId, setCachedId] = useState(inQuery);
    useEffect(() => {
        if (cachedId !== inQuery && inQuery) setCachedId(inQuery);
    }, [cachedId]);

    return cachedId;
}

export const useNavigationType = () => {
    const goingBack = useRef(false);
    const [type, setType] = useState<'forward' | 'back'>();
    const router = useRouter();

    useEffect(() => router.beforePopState(() => goingBack.current = true), []);
    useEffect(() => {
        const completeListener = () => {
            goingBack.current = false;
        }
        router.events.on('routeChangeComplete', completeListener);

        const startListener = () => setType(goingBack.current ? 'back' : 'forward');
        router.events.on('routeChangeStart', startListener);

        return () => {
            router.events.off('routeChangeStart', startListener);
            router.events.off('routeChangeComplete', completeListener);
        };
    }, [router]);

    return type;
}