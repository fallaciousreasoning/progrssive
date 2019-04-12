import { Card, CardContent, CardHeader, CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import {useEffect} from 'react';
import { useIsPhone } from "./hooks/responsive";
import { useEntry } from "./hooks/stream";
import { getEntryByline, getEntryContent } from "./services/entry";
import { getStore, useStore } from "./hooks/store";
import { updateEntry } from "./actions/entry";
import AppBarButton from "./components/AppBarButton";
import { EntryReadButton, EntrySavedButton } from "./MarkerButton";

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
    const store = useStore();
    const entry = store.entries[props.match.params.entryId];

    useEffect(() => {
        if (entry) return;
        updateEntry(props.match.params.entryId);
    }, [props.match.params.entryId]);

    const styles = useStyles();
    const isPhone = useIsPhone();

    if (!entry) 
        return <CircularProgress/>;

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
        {isPhone
            ? article
            : <Card>{article}</Card>}
        <AppBarButton>
            <EntryReadButton entry={entry}/>
        </AppBarButton>
        <AppBarButton>
            <EntrySavedButton entry={entry}/>
        </AppBarButton>
    </article>;
}