import { Card, CardContent, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';
import { Article } from "./model/article";

export default (props: { article: Article }) => {
    return (
        <Paper>
            <Card>
                <CardMedia
                    image={props.article.thumbnail && props.article.thumbnail[0].url}
                    title="Thumbnail"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        {props.article.title}
                    </Typography>
                    <Typography>
                        {props.article.engagement} {props.article.origin && props.article.origin.title} / {(props.article.published)}
                    </Typography>
                    <Typography component="small">
                        {props.article.summary.content}
                    </Typography>
                </CardContent>
            </Card>
        </Paper>
    );
}