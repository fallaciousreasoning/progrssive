import { Card, CardContent, CardMedia, Paper, Typography } from "@material-ui/core";
import React from 'react';

export default (props) => {
    const { classes } = props;
    return (
        <Paper>
            <Card>
                <CardMedia
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                />
                <CardContent>
                    <Typography gutterBottom variant="headline" component="h2">
                        Headline
                    </Typography>
                    <Typography>
                        [Reads] [Source] / [Age]
                    </Typography>
                    <Typography component="small">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at ullamcorper velit. Nam vitae consectetur erat. Nunc vulputate erat nec lorem viverra, eu semper est interdum.
                    </Typography>
                </CardContent>
            </Card>
        </Paper>
    );
}