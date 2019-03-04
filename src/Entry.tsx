import { Card, CardContent, CardHeader, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from 'react';
import { Entry } from "./model/entry";

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
    const subheader = `${props.entry.engagement} ${props.entry.origin && props.entry.origin.title} / ${(props.entry.published)}`;

    const detail = props.entry.content || props.entry.summary;
    const content = detail && detail.content;

    return <article className={styles.root}>
            <Card>
                <CardHeader
                    title={props.entry.title}
                    subheader={subheader} />
                {content && <CardContent>
                    <Typography component="small">
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </Typography>
                </CardContent>}
            </Card>
    </article>;
}