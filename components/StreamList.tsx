import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { collect, Store } from 'react-recollect';
import { useHistory, useLocation } from "react-router-dom";
import { FixedSizeList } from 'react-window';
import { setUnread } from '../actions/marker';
import { useScreenSize } from '../hooks/screenSize';
import { getStore } from '../hooks/store';
import { getStreamEntries, getStreamEntry } from '../selectors/entry';
import { getEntryUrl, getProgrssiveUrl, useViewMode } from '../services/entry';
import { useSettings } from '../services/settings';
import { loadToEntry } from '../services/store';
import EntryCard from './EntryCard';

const GUTTER_SIZE = 8;

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

const Row = collect((props: { index: number, style: any, store: Store }) => {
    const history = useHistory();
    const location = useLocation();
    
    const item = getStreamEntry(props.index);
    const [viewMode] = useViewMode(item);
    const newStyle = useMemo(() => ({
        ...props.style,
        top: props.style.top + GUTTER_SIZE,
        left: 1,
        right: 1,
        width: `100% - ${GUTTER_SIZE * 2}`
    }), [props.style, GUTTER_SIZE]);
    const settings = useSettings();

    const onClick = useCallback(() => {
        if (viewMode === "browser") {
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
        if (settings.markOpenedAsRead) {
            setUnread(item, false);
        }
    }, [settings.markOpenedAsRead, viewMode, item.id]);

    return item ? <div
        style={newStyle}
        onClick={onClick}
    >
        <EntryCard entry={item} showingUnreadOnly={props.store.stream.unreadOnly} />
    </div> : null;
});

const StreamList = (props: Props) => {
    const BUFFER_ENTRY_COUNT = 20;

    const styles = useStyles();
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
        {rowProps => <Row {...rowProps} />}
    </FixedSizeList>;
}

export default collect(StreamList);