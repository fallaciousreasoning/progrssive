import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { ExpandMore, RssFeed } from '@material-ui/icons';
import * as React from 'react';
import CollapsableListItem from './CollapsableListItem';
import { CategorizedSubscriptions } from './hooks/subscription';
import { Subscription } from './model/subscription';

interface Props {
    category: CategorizedSubscriptions;
}

const SubscriptionView = (props: { subscription: Subscription }) => {
    return <ListItem button component="a">
        <ListItemText>
            {props.subscription.title}
        </ListItemText>
    </ListItem>
}

export default (props: Props) => {
    return <CollapsableListItem
        defaultOpen={true}
        header={<ListItem button>
            <ListItemIcon>
                <RssFeed/>
            </ListItemIcon>
            <ListItemText>{props.category.label}</ListItemText>
        </ListItem>}>
        {props.category.subscriptions.map(s => <SubscriptionView key={s.id} subscription={s} />)}
    </CollapsableListItem>
}