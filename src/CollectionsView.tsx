import * as React from 'react';
import CollectionView from './CollectionView';
import { useCollections } from './hooks/collections';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { RssFeed } from '@material-ui/icons';
import { withRouter, RouteComponentProps } from 'react-router';
import { useProfile } from './hooks/profile';
import { getAllId, getSavedId } from './api/streams';
import { useStore } from './hooks/store';

const ManualEntry = withRouter((props: RouteComponentProps & { text: string, categoryId: string }) => {
    return <ListItem onClick={() => props.history.push(`/stream/${props.categoryId}`)} button>
        <ListItemIcon>
            <RssFeed />
        </ListItemIcon>
        <ListItemText>{props.text}</ListItemText>
    </ListItem>;
});

export default (props) => {
    const profile = useProfile();
    const categories = useCollections();

    return <>
        <ManualEntry text="All" categoryId={getAllId(profile && profile.id)} />
        <ManualEntry text="Saved" categoryId={getSavedId(profile && profile.id)} />
        {categories.map(c => <CollectionView collection={c} key={c.id} />)}
    </>;
}