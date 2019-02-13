import { Card, CardContent, CardHeader, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Entry } from "./model/entry";

export default (props: { entry: Entry }) => {
    const visualUrl = props.entry.visual && props.entry.visual.url;
    const subheader = `${props.entry.engagement} ${props.entry.origin && props.entry.origin.title} / ${(props.entry.published)}`;
    const content = props.entry.summary && props.entry.summary.content;
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