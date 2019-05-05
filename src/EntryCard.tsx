import { Card, CardContent, CardHeader, CardMedia, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from 'react';
import { Entry } from "./model/entry";
import { getEntryByline, getEntrySummary, getEntryVisualUrl } from "./services/entry";

const useStyles = makeStyles({
    paper: {
        cursor: 'pointer',
        position: 'relative'
    },
    card: {
        maxHeight: '500px'
    },
    read: {
        color: '#F0F0F0 !important'
    },
    unread: {

    },
    tint: {
        background: '#FFFFFF',
        opacity: 0.6,
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        position: 'absolute'
    }
});

export default (props: { entry: Entry, showingUnreadOnly?: boolean }) => {
    const styles = useStyles();

    const visualUrl = getEntryVisualUrl(props.entry);
    const subheader = getEntryByline(props.entry);
    const summary = getEntrySummary(props.entry);

    // Tint unread articles if and only if they are read and only unread articles are meant to be displayed.
    const tintGray = !props.entry.unread && props.showingUnreadOnly;

    return <Paper className={styles.paper}>
            <Card className={styles.card}>
                <CardHeader
                    title={props.entry.title}
                    subheader={subheader}/>

                {visualUrl && <CardMedia
                    src={visualUrl}
                    component='img'
                    title="Visual"
                    />}
                {summary && <CardContent>
                    <Typography component="small">
                        <div dangerouslySetInnerHTML={{ __html: summary }}></div>
                    </Typography>
                </CardContent>}
            </Card>
            {tintGray && <div className={styles.tint}></div>}
        </Paper>;
}