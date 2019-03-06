import { Card, CardContent, CardHeader, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import { useIsPhone } from "./hooks/responsive";
import { useEntry } from "./hooks/stream";
import { ScrollToTopOnMount } from "./Scroller";
import { getEntryByline, getEntryContent } from "./services/entry";

const useStyles = makeStyles({
    root: {
        maxWidth: '1000px',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    '@global': {
        'article img': {
            width: '100%'
        },
        'article figure': {
            margin: 0
        }
    }
});

export default (props: { match: { params: { entryId: string } } }) => {
    const entry = useEntry(props.match.params.entryId);
    const styles = useStyles();
    const isPhone = useIsPhone();

    if (!entry) 
        <CircularProgress/>;

    const content = getEntryContent(entry);

    const article = <>
        <CardHeader
            title={entry.title}
            subheader={getEntryByline(entry)} />
        {content && <CardContent>
            <Typography component="small">
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Typography>
        </CardContent>}
    </>;

    return <article className={styles.root}>
        <ScrollToTopOnMount/>
        {isPhone
            ? article
            : <Card>{article}</Card>}
    </article>;
}