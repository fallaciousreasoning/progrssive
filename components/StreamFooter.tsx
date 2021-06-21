import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { updateStreams } from '../actions/stream';
import { useIsPhone } from '../hooks/responsive';
import { getStreamUpdating } from '../hooks/store';
import { getDb } from '../services/db';
import LinkButton from './LinkButton';
import StackPanel from './StackPanel';

interface Props {
    unreadOnly: boolean;
    streamId: string;
}

const useStyles = makeStyles(theme => ({
    footerLoader: {
        marginRight: theme.spacing(1)
    },
    text: {
        color: theme.palette.text.primary,
        marginBottom: theme.spacing(1)
    }
}))

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
    const styles = useStyles();
    const isPhone = useIsPhone();
    const subscriptions = useLiveQuery(async () => {
        const db = await getDb();
        return db.subscriptions.toArray();
    });
    const hasSubscriptions = !!subscriptions.length;
    const loading = !!getStreamUpdating(props.streamId);

    return <StackPanel
        direction="column"
        justifyContent="start"
        alignItems="center"
        variants={rootAnimation}
        transition={transition}
        key={`${props.streamId}?${props.unreadOnly ? "showUnread" : ""}`}>
        <Typography className={styles.text} variant='h3' align='center' key="message">
            {hasSubscriptions
                ? "That's everything!"
                : "You don't have any subscriptions"}
        </Typography>
        <StackPanel direction={isPhone ? 'column' : 'row'} key="buttons">
            {props.unreadOnly && hasSubscriptions && <LinkButton fullWidth href="?showUnread" variant="contained" color="secondary" key="showUnread">
                Show Read
                </LinkButton>}
            <LinkButton fullWidth href="/subscriptions?query=" variant="contained" color="secondary" key="addSubscriptions">
                Add Subscriptions
                </LinkButton>
            {hasSubscriptions && <Button fullWidth disabled={loading} variant="contained" color="secondary" key="refresh" onClick={() => updateStreams(props.streamId)}>
                {loading && <CircularProgress size={16} className={styles.footerLoader} />} Refresh
                </Button>}
        </StackPanel>
    </StackPanel>
};