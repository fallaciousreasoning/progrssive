import { useIsPhone } from '@/hooks/responsive';
import { useIsFrontend } from '@/hooks/useIsFrontend';
import { getScrollPos, setScrollPos } from '@/services/entryIterator';
import { setUnread } from 'actions/marker';
import { useScreenSize } from 'hooks/screenSize';
import { getStore } from 'hooks/store';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { collect, Store } from 'react-recollect';
import { FixedSizeList } from 'react-window';
import { getStreamEntries, getStreamEntry } from 'selectors/entry';
import { getEntryUrl, getProgrssiveUrl, useViewMode } from 'services/entry';
import { useSettings } from 'services/settings';
import { loadToEntry } from 'services/store';
import EntryCard from './EntryCard';

const GUTTER_SIZE = 8;

interface Props {
    onProgressChanged?: (progress: number) => void;
    store: Store;
}

const Row = collect((props: { index: number, style: any, store: Store }) => {
    const router = useRouter();
    const item = getStreamEntry(props.index);
    const [viewMode] = useViewMode(item);

    const newStyle = useMemo(() => ({
        ...props.style,
        top: props.style.top + GUTTER_SIZE,
        width: `100%`
    }), [props.style]);
    const settings = useSettings();

    const onClick = useCallback(() => {
        if (!item) return;

        if (viewMode === "browser") {
            window.open(getEntryUrl(item), "_blank");
        } else {
            const url = getProgrssiveUrl(item);
            // If we're currently looking at an entry,
            // replace it.
            const action = router.pathname.includes('/entry/')
                ? router.replace
                : router.push;
            action(url);
        }

        // If pages should be marked as read on open, do that.
        if (settings.markOpenedAsRead) {
            setUnread(item, false);
        }
    }, [settings.markOpenedAsRead, viewMode, item?.id]);

    return item ? <div
        className="p-1"
        style={newStyle}
        onClick={onClick}
    >
        <EntryCard entry={item} showingUnreadOnly={props.store.stream.unreadOnly} />
    </div> : null;
});

const StreamList = (props: Props) => {
    const BUFFER_ENTRY_COUNT = 20;

    const { width, height } = useScreenSize();
    const loadedEntries = getStreamEntries();
    const settings = useSettings();
    const markScrolledAsRead = settings.markScrolledAsRead && props.store.stream.unreadOnly;

    const [lastVisibleStartIndex, setLastVisibleStartIndex] = useState(0)
    const onItemsRendered = useCallback(async ({ visibleStartIndex, visibleStopIndex }) => {
        if (visibleStopIndex % BUFFER_ENTRY_COUNT === 0 || visibleStopIndex >= getStore().stream.loadedEntries.length)
            loadToEntry(visibleStopIndex + BUFFER_ENTRY_COUNT);

        if (!markScrolledAsRead)
            return;

        for (let i = lastVisibleStartIndex; i < visibleStartIndex; ++i) {
            const entry = loadedEntries[i];
            if (entry)
                setUnread(entry, false);
        }

        setLastVisibleStartIndex(visibleStartIndex);
    }, [lastVisibleStartIndex, loadedEntries, markScrolledAsRead]);

    const listHeight = height - 48 - GUTTER_SIZE * 2;
    const itemHeight = 200;
    const totalScrollHeight = props.store.stream.length * itemHeight;
    const listRef = useRef<FixedSizeList>();
    const listOuterRef = useRef<HTMLDivElement>();

    const onProgressChanged = props.onProgressChanged;
    const onScrolled = useCallback(({ scrollOffset }) => {
        const dps = 5;
        const exponent = 10 ** dps;
        let percent = Math.round(scrollOffset / (totalScrollHeight - listHeight) * exponent) / exponent;
        if (!isFinite(percent) || isNaN(percent))
            percent = 0;

        if (onProgressChanged)
            onProgressChanged(percent);

        setScrollPos(listOuterRef.current.scrollTop);
    }, [totalScrollHeight, listHeight, onProgressChanged]);

    const parentWidth = listOuterRef.current && listOuterRef.current.parentElement
        ? listOuterRef.current.parentElement.getBoundingClientRect().width
        : width;
    
    if (!useIsFrontend()) return null;

    return <FixedSizeList
        ref={listRef}
        outerRef={listOuterRef}
        onScroll={onScrolled}
        className="ml-auto mr-auto"
        height={listHeight}
        itemSize={itemHeight}
        initialScrollOffset={getScrollPos()}
        itemCount={props.store.stream.length || 0}
        width={Math.min(800, parentWidth)}
        itemKey={(index) => index < loadedEntries.length ? loadedEntries[index].id : index}
        onItemsRendered={onItemsRendered}>
        {rowProps => <Row {...rowProps} />}
    </FixedSizeList>;
}

export default collect(StreamList);