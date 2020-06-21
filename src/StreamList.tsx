import * as React from 'react';
import { makeStyles, CircularProgress } from '@material-ui/core';
import { Entry } from './model/entry';
import { useScreenSize } from './hooks/screenSize';
import { FixedSizeList } from 'react-window';
import { useState, useCallback, useMemo } from 'react';
import { setUnread } from './actions/marker';
import { useStore } from './hooks/store';
import EntryCard from './EntryCard';
import { useHistory } from "react-router-dom";
import { getEntrySubscription, getEntryUrl } from './services/entry';
import { entryIterator, entryCount } from './services/entryIterator';
import { useResult } from './hooks/promise';

interface Props {
    streamId: string;
    unreadOnly: boolean;
}

const useStyles = makeStyles({
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});

// A utility class for maintaining a list of entries.
class EntryList {
    length: Promise<number>;
    iterator: AsyncGenerator<Entry>;
    loadedEntries: Entry[] = [];

    constructor(unreadOnly: boolean, streamId: string) {
        this.iterator = entryIterator(unreadOnly, streamId);
        this.length = entryCount(unreadOnly, streamId);
    }

    async get(index: number) {
        // Promise is kept, so we only query the db once.
        const length = await this.length;

        // Index is out of range.
        if (index >= length || index < 0)
            return undefined;

        // Keep loading more entries till we know the right one.
        while (this.loadedEntries.length < index) {
            const next = await this.iterator.next();
            if (!next.value)
                break;

            this.loadedEntries.push(next.value);
        }

        return this.loadedEntries[index];
    }
}

export default (props: Props) => {
    const GUTTER_SIZE = 8;

    const styles = useStyles();
    const { width, height } = useScreenSize();

    const history = useHistory();

    const store = useStore();
    const markScrolledAsRead = store.settings.markScrolledAsRead;

    // Get a list of entries matching the current filters.
    const entryList = useMemo(() => new EntryList(props.unreadOnly, props.streamId),
        [props.unreadOnly, props.streamId]);
    const entryCount = useResult(entryList.length, [entryList], 0);

    const [lastVisibleStartIndex, setLastVisibleStartIndex] = useState(0)
    const onItemsRendered = useCallback(async ({ visibleStartIndex }) => {
        if (!markScrolledAsRead)
            return;

        for (let i = lastVisibleStartIndex; i < visibleStartIndex; ++i) {
            const entry = await entryList.get(i);
            setUnread(entry, false);
        }

        setLastVisibleStartIndex(visibleStartIndex);
    }, [props.unreadOnly, props.streamId, lastVisibleStartIndex]);

    console.log(entryCount)
    return <FixedSizeList
        className={styles.root}
        height={height - 62 - GUTTER_SIZE * 2}
        itemSize={208}
        itemCount={entryCount}
        width={Math.min(800, width)}
        itemKey={(index) => index < entryList.loadedEntries.length ? entryList.loadedEntries[index].id : index}
        onItemsRendered={onItemsRendered}>
        {rowProps => {
            const item: Entry = useResult(entryList.get(rowProps.index), [entryList]);
            const newStyle = {
                ...rowProps.style,
                top: rowProps.style.top + GUTTER_SIZE,
                left: rowProps.style.left + GUTTER_SIZE,
                right: GUTTER_SIZE,
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
                }}
            >
                <EntryCard entry={item} showingUnreadOnly={store.settings.unreadOnly} />
            </div>
            : <div style={newStyle}>
                <CircularProgress/>
            </div>;
        }}
    </FixedSizeList>
}