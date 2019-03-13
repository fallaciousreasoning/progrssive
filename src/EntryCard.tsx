import { Card, CardContent, CardHeader, CardMedia, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from 'react';
import { Entry } from "./model/entry";
import { getEntryByline, getEntrySummary, getEntryVisualUrl } from "./services/entry";

const useStyles = makeStyles({
    paper: {
        cursor: 'pointer',
    },
    card: {
        maxHeight: '500px'
    }
});

export default (props: { entry: Entry }) => {
    const styles = useStyles();

    const visualUrl = getEntryVisualUrl(props.entry);
    const subheader = getEntryByline(props.entry);
    const summary = getEntrySummary(props.entry);
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
        </Paper>;
}