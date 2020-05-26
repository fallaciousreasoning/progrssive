import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Entry } from './model/entry';
import { useScreenSize } from './hooks/screenSize';
import { FixedSizeList } from 'react-window';
import { useState, useCallback } from 'react';
import { setUnread } from './actions/marker';
import { useStore } from './hooks/store';
import EntryCard from './EntryCard';
import { useHistory } from "react-router-dom";
import { getEntrySubscription, getEntryUrl } from './services/entry';

interface Props {
    entries: Entry[];
}

const useStyles = makeStyles({
    root: {
        marginLeft: 'auto',
        marginRight: 'auto',
    }
});

export default (props: Props) => {
    const GUTTER_SIZE = 8;

    const store = useStore();
    const markScrolledAsRead = store.settings.markScrolledAsRead;
    const styles = useStyles();
    const { width, height } = useScreenSize();
    const history = useHistory();
    const [lastVisibleStartIndex, setLastVisibleStartIndex] = useState(0);
    const onItemsRendered = useCallback(({ visibleStartIndex }) => {
        if (!markScrolledAsRead)
            return;

        for (let i = lastVisibleStartIndex; i < visibleStartIndex; ++i) {
            setUnread(props.entries[i], false);
        }

        setLastVisibleStartIndex(visibleStartIndex);
    }, [props.entries, lastVisibleStartIndex]);
    return <FixedSizeList
        className={styles.root}
        itemData={props.entries}
        height={height - 62 - GUTTER_SIZE * 2}
        itemSize={208}
        itemCount={props.entries.length}
        width={Math.min(800, width)}
        onItemsRendered={onItemsRendered}
        itemKey={(index, data) => data[index].id}>
        {rowProps => {
            const item: Entry = rowProps.data[rowProps.index];
            const newStyle = {
                ...rowProps.style,
                top: rowProps.style.top + GUTTER_SIZE,
                left: rowProps.style.left + GUTTER_SIZE,
                right: GUTTER_SIZE,
                width: `100% - ${GUTTER_SIZE * 2}`
            };
            return <div
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
            </div>;
        }}
    </FixedSizeList>
}