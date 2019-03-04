import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import { useIsPhone } from "./hooks/responsive";
import { Entry } from "./model/entry";
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

export default (props: { entry: Entry }) => {
    
    if (!props.entry) return null;

    const styles = useStyles();
    const isPhone = useIsPhone();
    const content = getEntryContent(props.entry);

    const article = <>
        <CardHeader
            title={props.entry.title}
            subheader={getEntryByline(props.entry)} />
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
    </article>;
}