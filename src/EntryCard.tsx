import { Card, CardContent, CardHeader, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Entry } from "./model/entry";
import { getEntryByline, getEntryContent, getEntryVisualUrl } from "./services/entry";

export default (props: { entry: Entry }) => {
    const visualUrl = getEntryVisualUrl(props.entry);
    const subheader = getEntryByline(props.entry);
    const content = getEntryContent(props.entry);
    return (
        <Paper>
            <Card style={{ maxHeight: '500px'}}>
                <CardHeader
                    title={props.entry.title}
                    subheader={subheader}/>

                {visualUrl && <CardMedia
                    src={visualUrl}
                    component='img'
                    title="Visual"
                />}
                {content && <CardContent>
                    <Typography component="small">
                        <div dangerouslySetInnerHTML={{ __html: content }}></div>
                    </Typography>
                </CardContent>}
            </Card>
        </Paper>
    );
}