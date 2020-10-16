import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Entry } from "../model/entry";
import { getEntryByline, getEntryContent, getEntryVisualUrl } from "../services/entry";

const useStyles = makeStyles(theme => ({
    paper: {
        cursor: 'pointer',
        position: 'relative' as any
    },
    card: {
        height: '200px',
    },
    content: {
        display: 'flex',
        flexBasis: 1
    },
    cardHeader: {
        paddingBottom: 0,
        maxLines: 4,
        '& span': {
            maxHeight: '3em',
            overflow: 'hidden'
        }
    },
    cardContent: {
        paddingTop: 0,
    },
    summary: {
        maxHeight: '10px',
        overflow: 'none',
        '& img': {
            display: 'none'
        },
        '& small': {
            display: 'none'
        }
    },
    detail: {
        flex: 1,
        minWidth: 0
    },
    read: {
        color: '#F0F0F0 !important'
    },
    unread: {

    },
    tint: {
        background: theme.palette.background.paper,
        opacity: 0.6,
        top: '0',
        left: '0',
        bottom: '0',
        right: '0',
        position: 'absolute' as any
    },
    image: {
        height: '200px',
        maxWidth: '100px',
        flex: 0,
        [theme.breakpoints.up('sm')]: {
            maxWidth: '200px'
        }
    }
}));

const EntryCard = (props: { entry: Entry, showingUnreadOnly?: boolean }) => {
    const styles = useStyles();

    const visualUrl = getEntryVisualUrl(props.entry);
    const subheader = getEntryByline(props.entry);
    const summary = getEntryContent(props.entry);

    const [imageUrl, setImageUrl] = useState(visualUrl);
    useEffect(() => {
        setImageUrl(visualUrl);
    }, [visualUrl]);

    // Unset the image url when there's an error.
    const onImageError = useCallback((e) => {
        setImageUrl(null);
    }, []);

    // Tint unread articles if and only if they are read and only unread articles are meant to be displayed.
    const tintGray = !props.entry.unread && props.showingUnreadOnly;

    return <Paper className={styles.paper}>
        <Card className={styles.card}>
            <div className={styles.content}>
                <div className={styles.detail}>
                    <CardHeader
                        className={styles.cardHeader}
                        titleTypographyProps={{ variant: "body1" }}
                        title={props.entry.title} subheader={subheader} />
                    {summary && <CardContent className={styles.cardContent}>
                        <Typography component="small" variant="body2">
                            <div className={styles.summary} dangerouslySetInnerHTML={{ __html: summary }}></div>
                        </Typography>
                    </CardContent>}
                </div>
                {imageUrl && <CardMedia
                    onError={onImageError}
                    src={imageUrl}
                    component='img'
                    title="Visual"
                    className={styles.image}
                />}
            </div>
        </Card>
        {tintGray && <div className={styles.tint}></div>}
    </Paper>;
}

export default memo(EntryCard);