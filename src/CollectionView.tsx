import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { ExpandMore, RssFeed, ExpandLess } from '@material-ui/icons';
import * as React from 'react';
import CollapsableListItem from './CollapsableListItem';
import { Subscription } from './model/subscription';
import { withRouter, RouteComponentProps } from 'react-router';
import { Collection, Feed } from './model/collection';

interface Props extends RouteComponentProps<{}> {
    collection: Collection;
}


const SubscriptionView = withRouter((props: { feed: Feed } & RouteComponentProps<any>) => {

    return <ListItem button onClick={() => props.history.push(`/stream/${props.feed.feedId}`)}>
        <ListItemText>
            {props.feed.title}
        </ListItemText>
    </ListItem>
})

export default withRouter((props: Props) => {
    return <CollapsableListItem
        defaultOpen={true}
        header={p => <ListItem button onClick={() => props.history.push(`/stream/${props.collection.id}`)}>
            <ListItemIcon>
                <RssFeed />
            </ListItemIcon>
            <ListItemText>{props.collection.label}</ListItemText>
            <div onClick={p.toggle}>
                {p.open ? <ExpandLess /> : <ExpandMore />}
            </div>
        </ListItem>}>
        {props.collection.feeds.map(s => <SubscriptionView key={s.id} feed={s} />)}
    </CollapsableListItem>
})