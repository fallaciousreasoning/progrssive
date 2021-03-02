import { makeStyles } from '@material-ui/core/styles';
import { Console } from 'console';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { collect, store, Store } from 'react-recollect';
import { useHistory, useLocation } from "react-router-dom";
import { FixedSizeList } from 'react-window';
import { setUnread } from './actions/marker';
import EntryCard from './components/EntryCard';
import { useScreenSize } from './hooks/screenSize';
import { getStore } from './hooks/store';
import { getStreamEntries, getStreamEntry } from './selectors/entry';
import { getEntrySubscription, getEntryUrl, getProgrssiveUrl } from './services/entry';
import { loadToEntry } from './services/store';

interface Props {
    onProgressChanged?: (progress: number) => void;
    store: Store;
}

const useStyles = makeStyles({
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});

const StreamList = (props: Props) => {
    const GUTTER_SIZE = 8;
    const BUFFER_ENTRY_COUNT = 20;

    const styles = useStyles();
    const { width, height } = useScreenSize();

    const history = useHistory();
    const location = useLocation();

    const loadedEntries = getStreamEntries();
    const markScrolledAsRead = props.store.settings.markScrolledAsRead && props.store.stream.unreadOnly;

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
    const itemHeight = 208;
    const totalScrollHeight = props.store.stream.length * itemHeight;
    const listRef = useRef<FixedSizeList>();
    const listOuterRef = useRef<HTMLDivElement>();

    // Update the scroll pos on unmount.
    useEffect(() => {
        const list = listOuterRef.current;
        const wasUnreadOnly = props.store.stream.unreadOnly;
        return () => {
            // If we were unmounted because the stream changed, don't store the
            // scroll position.
            if (wasUnreadOnly !== props.store.stream.unreadOnly)
                return;

            props.store.stream.lastScrollPos = list.scrollTop;
        }
    }, [])

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

    const parentWidth = listOuterRef.current && listOuterRef.current.parentElement
        ? listOuterRef.current.parentElement.getBoundingClientRect().width
        : width;
    return <FixedSizeList
        ref={listRef}
        outerRef={listOuterRef}
        onScroll={onScrolled}
        className={styles.root}
        height={listHeight}
        itemSize={itemHeight}
        initialScrollOffset={props.store.stream.lastScrollPos}
        itemCount={props.store.stream.length || 0}
        width={Math.min(800, parentWidth - GUTTER_SIZE * 2)}
        itemKey={(index) => index < loadedEntries.length ? loadedEntries[index].id : index}
        onItemsRendered={onItemsRendered}>
        {rowProps => {
            const item = getStreamEntry(rowProps.index);
            const newStyle = useMemo(() => ({
                ...rowProps.style,
                top: rowProps.style.top + GUTTER_SIZE,
                left: 1,
                right: 1,
                width: `100% - ${GUTTER_SIZE * 2}`
            }), [rowProps.style, GUTTER_SIZE]);
            return item ? <div
                style={newStyle}
                onClick={() => {
                    const subscription = getEntrySubscription(item);
                    if (subscription && subscription.preferredView === "browser") {
                        window.open(getEntryUrl(item), "_blank");
                    } else {
                        const url = getProgrssiveUrl(item);
                        // If we're currently looking at an entry,
                        // replace it.
                        const action = location.pathname.includes('/entries/')
                            ? history.replace
                            : history.push;
                        action(url);
                    }

                    // If pages should be marked as read on open, do that.
                    if (props.store.settings.markOpenedAsRead) {
                        setUnread(item, false);
                    }
                }}
            >
                <EntryCard entry={item} showingUnreadOnly={props.store.stream.unreadOnly} />
            </div> : null;
        }}
    </FixedSizeList>;
}

export default collect(StreamList);