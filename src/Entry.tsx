import { Card, CardContent, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Entry } from "./model/entry";

export default (props: { entry: Entry }) => {
    const visualUrl = props.entry.visual && props.entry.visual.url;
    console.log(visualUrl)
    return (
        <Paper>
            <Card>
                {visualUrl && <CardMedia
                    src={visualUrl}
                    component='img'
                    title="Thumbnail"
                />}
                <CardContent style={{ maxHeight: '500px' }}>
                    <Typography gutterBottom variant="headline" component="h2">
                        {props.entry.title}
                    </Typography>
                    <Typography>
                        {props.entry.engagement} {props.entry.origin && props.entry.origin.title} / {(props.entry.published)}
                    </Typography>
                    <Typography component="small">
                        <div dangerouslySetInnerHTML={{ __html: props.entry.summary && props.entry.summary.content }}></div>
                    </Typography>
                </CardContent>
            </Card>
        </Paper>
    );
}