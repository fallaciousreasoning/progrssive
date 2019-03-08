import { ExpansionPanel, ExpansionPanelSummary } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import * as React from 'react';

interface Props {
    categoryId: string;
}
 
export default (props: Props) => {
    return <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
            
        </ExpansionPanelSummary>
    </ExpansionPanel>
}