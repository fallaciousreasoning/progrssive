import * as React from 'react';
import { TextField } from "@material-ui/core"
import { useState } from 'react';

export const SubscriptionManager = (props) => {
    const [query, setQuery] = useState("@subscribed");

    return <div>
        <TextField
            label="Search term or feed url"
            variant="filled"
            fullWidth
            value={query}
            onChange={e => setQuery(e.target.value)}/>
        
    </div>
}