import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { ExpandMore, RssFeed } from '@material-ui/icons';
import * as React from 'react';
import CollapsableListItem from './CollapsableListItem';
import { CategorizedSubscriptions } from './hooks/subscription';
import { Subscription } from './model/subscription';
import { withRouter, RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<{}> {
    category: CategorizedSubscriptions;
}


const SubscriptionView = withRouter((props: { subscription: Subscription } & RouteComponentProps<any>) => {
    
    return <ListItem button onClick={() => props.history.push(`/stream/${props.subscription.id}`)}>
        <ListItemText>
            {props.subscription.title}
        </ListItemText>
    </ListItem>
})

export default withRouter((props: Props) => {
    return <CollapsableListItem
        defaultOpen={true}
        header={<ListItem button onClick={() => props.history.push(`/stream/${props.category.id}`)}>
            <ListItemIcon>
                <RssFeed/>
            </ListItemIcon>
            <ListItemText>{props.category.label}</ListItemText>
        </ListItem>}>
        {props.category.subscriptions.map(s => <SubscriptionView key={s.id} subscription={s} />)}
    </CollapsableListItem>
})