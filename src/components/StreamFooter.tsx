import React from 'react'
import StackPanel from './StackPanel'
import LinkButton from './LinkButton'
import { Button, CircularProgress, Typography, makeStyles } from '@material-ui/core'
import { updateStreams } from '../actions/stream'
import { useIsPhone } from '../hooks/responsive'
import { useStore } from '../hooks/store'

interface Props {
    unreadOnly: boolean;
}

const useStyles = makeStyles(theme => ({
    footerLoader: {
        marginRight: theme.spacing(1)
    }
}))

export default (props: Props) => {
    const styles = useStyles();
    const isPhone = useIsPhone();
    const store = useStore();
    const hasSubscriptions = !!store.subscriptions.length;
    const loading = !!store.updating.stream;

    return <StackPanel direction="column-reverse" center>
        <StackPanel direction={isPhone ? 'column' : 'row'}>
            {props.unreadOnly && hasSubscriptions && <LinkButton fullWidth href="?showUnread" variant="contained" color="secondary">
                Show Unread
      </LinkButton>}
            <LinkButton fullWidth href="/subscriptions?query=" variant="contained" color="secondary">
                Add Subscriptions
      </LinkButton>
            {hasSubscriptions && <Button fullWidth disabled={loading} variant="contained" color="secondary" onClick={() => updateStreams(store.stream.id)}>
                {loading && <CircularProgress size={16} className={styles.footerLoader} />} Refresh
      </Button>}
        </StackPanel>
        <Typography variant='h3' align='center'>
            {hasSubscriptions ? "That's everything!" : "You don't have any subscriptions"}
        </Typography>
    </StackPanel>
}