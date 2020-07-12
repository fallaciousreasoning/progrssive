import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { updateStreams } from '../actions/stream';
import { useIsPhone } from '../hooks/responsive';
import { useStore, getStreamUpdating } from '../hooks/store';
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
        opacity: 0
    },
    animate: {
        opacity: 1
    }
};

const transition = {
    duration: 1,
    delay: 0.2
};

export default (props: Props) => {
    const styles = useStyles();
    const isPhone = useIsPhone();
    const store = useStore();
    const hasSubscriptions = !!store.subscriptions.length;
    const loading = !!getStreamUpdating(store.stream.id);

    return <AnimatePresence>
        <motion.div
            variants={rootAnimation}
            initial="initial"
            animate="animate"
            transition={transition}
        >
            <StackPanel direction="column-reverse" center key={`${store.stream.id}?${store.stream.unreadOnly ? "showUnread" : ""}`}>
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
                <Typography className={styles.text} variant='h3' align='center' key="message">
                    {hasSubscriptions ? "That's everything!" : "You don't have any subscriptions"}
                </Typography>
            </StackPanel>
        </motion.div>
    </AnimatePresence>
}