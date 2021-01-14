import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { collect } from 'react-recollect';
import { updateStreams } from '../actions/stream';
import { useIsPhone } from '../hooks/responsive';
import { getStreamUpdating } from '../hooks/store';
import { CollectProps } from '../types/RecollectStore';
import LinkButton from './LinkButton';
import StackPanel from './StackPanel';

interface Props {
    unreadOnly: boolean;
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

export default collect((props: Props & CollectProps) => {
    const styles = useStyles();
    const isPhone = useIsPhone();
    const {store} = props;
    const hasSubscriptions = !!store.subscriptions.length;
    const loading = !!getStreamUpdating(store.stream.id);

    return <StackPanel
        direction="column"
        justifyContent="start"
        alignItems="center"
        variants={rootAnimation}
        transition={transition}
        key={`${store.stream.id}?${store.stream.unreadOnly ? "showUnread" : ""}`}>
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
            {hasSubscriptions && <Button fullWidth disabled={loading} variant="contained" color="secondary" key="refresh" onClick={() => updateStreams(store.stream.id)}>
                {loading && <CircularProgress size={16} className={styles.footerLoader} />} Refresh
                </Button>}
        </StackPanel>
    </StackPanel>
});