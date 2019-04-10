import * as React from 'react';
import CollectionView from './CollectionView';
import { useCollections } from './hooks/collections';
import { ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { RssFeed } from '@material-ui/icons';
import { withRouter } from 'react-router';
import { useProfile } from './hooks/profile';
import { getAllId } from './api/streams';
import { useStore } from './hooks/store';

const AllEntry = withRouter(props => {
    const profile = useProfile();
    return <ListItem onClick={() => props.history.push(`/stream/${getAllId(profile && profile.id)}`)} button>
        <ListItemIcon>
            <RssFeed />
        </ListItemIcon>
        <ListItemText>All</ListItemText>
    </ListItem>
});

export default (props) => {
    const categories = useCollections();

    return <>
        <AllEntry />
        {categories.map(c => <CollectionView collection={c} key={c.id} />)}
    </>;
}