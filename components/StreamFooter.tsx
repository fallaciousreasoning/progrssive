import Button from 'components/Button';
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
import { useShowRead } from '@/hooks/url';

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
    const { setShowRead } = useShowRead();
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
            {props.unreadOnly && hasSubscriptions && <Button className="w-full" color="secondary" key="showUnread" onClick={() => setShowRead(true)}>
                Show Read
                </Button>}
            <LinkButton className="w-full" href="/subscriptions?query=" color="secondary" key="addSubscriptions">
                Add Subscriptions
                </LinkButton>
            {hasSubscriptions && <Button className="w-full flex flex-row" disabled={loading} color="secondary" key="refresh" onClick={() => updateStreams(props.streamId)}>
                {loading && <LoadingSpinner size={4} className="-mr-1" />} Refresh
            </Button>}
        </StackPanel>
    </StackPanel>
};