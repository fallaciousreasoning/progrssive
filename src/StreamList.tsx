import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { FixedSizeList } from 'react-window';
import { setUnread } from './actions/marker';
import EntryCard from './EntryCard';
import { useStreamEntries, useStreamEntry } from './hooks/entry';
import { useScreenSize } from './hooks/screenSize';
import { getStore, useStore } from './hooks/store';
import useWhenChanged from './hooks/useWhenChanged';
import { getEntrySubscription, getEntryUrl } from './services/entry';
import { loadToEntry } from './services/store';

interface Props {
    onProgressChanged?: (progress: number) => void;
}

const useStyles = makeStyles({
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});

export default (props: Props) => {
    const GUTTER_SIZE = 8;
    const BUFFER_ENTRY_COUNT = 20;

    const styles = useStyles();
    const { width, height } = useScreenSize();

    const history = useHistory();

    const store = useStore();
    const loadedEntries = useStreamEntries();
    const markScrolledAsRead = store.settings.markScrolledAsRead && store.stream.unreadOnly;

    const [lastVisibleStartIndex, setLastVisibleStartIndex] = useState(0)
    const onItemsRendered = useCallback(async ({ visibleStartIndex, visibleStopIndex }) => {
        if (!markScrolledAsRead)
            return;

        for (let i = lastVisibleStartIndex; i < visibleStartIndex; ++i) {
            const entry = loadedEntries[i];
            if (entry)
                setUnread(entry, false);
        }

        setLastVisibleStartIndex(visibleStartIndex);

        if (visibleStopIndex % BUFFER_ENTRY_COUNT === 0)
            loadToEntry(visibleStopIndex + BUFFER_ENTRY_COUNT);
    }, [lastVisibleStartIndex, loadedEntries, markScrolledAsRead]);

    const listHeight = height - 48 - GUTTER_SIZE * 2;
    const itemHeight = 208;
    const totalScrollHeight = store.stream.length * itemHeight;
    const listRef = useRef<FixedSizeList>();
    const listOuterRef = useRef<HTMLDivElement>();

    // Update the scroll pos on unmount.
    useEffect(() => {
        return () => {
            getStore().stream.lastScrollPos = listOuterRef.current.scrollTop;
        }
    }, [])

    // Scroll to the top when the stream changes.
    useWhenChanged(() => {
        if (listOuterRef.current.scrollTop > store.stream.lastScrollPos)
            listRef.current && listRef.current.scrollTo(store.stream.lastScrollPos);
    },
        // Only scroll back to the top of the list when the stream we're viewing changes.
        [store.stream.id, store.stream.unreadOnly]);

    const onProgressChanged = props.onProgressChanged;
    const onScrolled = useCallback(({ scrollOffset }) => {
        const dps = 5;
        const exponent = 10 ** dps;
        let percent = Math.round(scrollOffset / (totalScrollHeight - listHeight) * exponent) / exponent;
        if (!isFinite(percent) || isNaN(percent))
            percent = 0;

        if (onProgressChanged)
            onProgressChanged(percent);
    }, [totalScrollHeight, listHeight, onProgressChanged]);

    return <FixedSizeList
        ref={listRef}
        outerRef={listOuterRef}
        onScroll={onScrolled}
        className={styles.root}
        height={listHeight}
        itemSize={itemHeight}
        initialScrollOffset={store.stream.lastScrollPos}
        itemCount={store.stream.length}
        width={Math.min(800, width - GUTTER_SIZE * 2)}
        itemKey={(index) => index < loadedEntries.length ? loadedEntries[index].id : index}
        onItemsRendered={onItemsRendered}>
        {rowProps => {
            const item = useStreamEntry(rowProps.index);

            const newStyle = {
                ...rowProps.style,
                top: rowProps.style.top + GUTTER_SIZE,
                left: 1,
                right: 1,
                width: `100% - ${GUTTER_SIZE * 2}`
            };
            return item ? <div
                style={newStyle}
                onClick={() => {
                    const subscription = getEntrySubscription(item);
                    if (subscription && subscription.preferredView === "browser") {
                        window.open(getEntryUrl(item), "_blank");
                    } else {
                        history.push(`/entries/${item.id}`);
                    }

                    // If pages should be marked as read on open, do that.
                    if (store.settings.markOpenedAsRead) {
                        setUnread(item, false);
                    }
                }}
            >
                <EntryCard entry={item} showingUnreadOnly={store.stream.unreadOnly} />
            </div> : null;
        }}
    </FixedSizeList>;
}