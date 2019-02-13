import { Card, CardContent, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Entry } from "./model/entry";

export default (props: { entry: Entry }) => {
    return (
        <Paper>
            <Card>
                <CardMedia
                    image={props.entry.thumbnail && props.entry.thumbnail[0].url}
                    title="Thumbnail"
                />
                <CardContent>
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