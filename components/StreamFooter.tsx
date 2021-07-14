import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { updateStreams } from '../actions/stream';
import { useIsPhone } from '../hooks/responsive';
import { getStreamUpdating } from '../hooks/store';
import { getDb } from '../services/db';
import LinkButton from './LinkButton';
import LoadingSpinner from './LoadingSpinner';
import StackPanel from './StackPanel';

interface Props {
    unreadOnly: boolean;
    streamId: string;
}

const rootAnimation = {
    initial: {
        opacity: 0,
        scale: 0
    },
    in: {
        opacity: 1,
        scale: 1
    }
};

const transition = {
    duration: 0.2,
    delay: 0.2
};

export default function StreamFooter(props: Props) {
    const isPhone = useIsPhone();
    const subscriptions = useLiveQuery(async () => {
        const db = await getDb();
        return db.subscriptions.toArray();
    }) ?? [];
    const hasSubscriptions = !!subscriptions.length;
    const loading = !!getStreamUpdating(props.streamId);

    return <StackPanel
        direction="col"
        justifyContent="start"
        alignItems="center"
        variants={rootAnimation}
        transition={transition}
        key={`${props.streamId}?${props.unreadOnly ? "showUnread" : ""}`}>
        <Typography className="text-foreground mb-2" variant='h3' align='center' key="message">
            {hasSubscriptions
                ? "That's everything!"
                : "You don't have any subscriptions"}
        </Typography>
        <StackPanel direction={isPhone ? 'col' : 'row'} key="buttons">
            {props.unreadOnly && hasSubscriptions && <LinkButton className="w-full" href="?showUnread" color="secondary" key="showUnread">
                Show Read
                </LinkButton>}
            <LinkButton className="w-full" href="/subscriptions?query=" color="secondary" key="addSubscriptions">
                Add Subscriptions
                </LinkButton>
            {hasSubscriptions && <Button className="w-full" disabled={loading} variant="contained" color="secondary" key="refresh" onClick={() => updateStreams(props.streamId)}>
                {loading && <LoadingSpinner size={4} className="mr-1" />} Refresh
            </Button>}
        </StackPanel>
    </StackPanel>
};