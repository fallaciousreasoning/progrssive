import { makeStyles, Card, CardContent, CardHeader, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Entry } from "./model/entry";
import { getEntryByline, getEntrySummary, getEntryVisualUrl } from "./services/entry";

const useStyles = makeStyles({
    paper: {
        cursor: 'pointer',
        position: 'relative'
    },
    card: {
        height: '200px',
    },
    content: {
        display: 'flex',
        flexBasis: 1
    },
    detail: {
        flex: 1
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
    },
    image: {
        height: '200px',
        maxWidth: '12em',
        flex: 0
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
            <div className={styles.content}>
                <div className={styles.detail}>
                    <CardHeader
                        titleTypographyProps={{ variant: "body1" }}
                        title={props.entry.title} subheader={subheader} />
                    {summary && <CardContent>
                        <Typography component="small" variant="body2">
                            <div dangerouslySetInnerHTML={{ __html: summary }}></div>
                        </Typography>
                    </CardContent>}
                </div>
                {visualUrl && <CardMedia
                    src={visualUrl}
                    component='img'
                    title="Visual"
                    className={styles.image}
                />}
            </div>
        </Card>
        {tintGray && <div className={styles.tint}></div>}
    </Paper>;
}