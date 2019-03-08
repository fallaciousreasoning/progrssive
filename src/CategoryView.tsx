import { ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import * as React from 'react';
import { Category } from './model/category';

interface Props {
    category: Category;
}
 
export default (props: Props) => {
    return <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            {props.category.label}
        </ExpansionPanelSummary>
    </ExpansionPanel>
}