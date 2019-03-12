import ReactDOM from "react-dom";
import React, { useState, useEffect } from 'react';

export default (props: { children: React.ReactNode }) => {
    const [appBar, setAppBar] = useState(undefined);

    useEffect(() => {
        setAppBar(document.getElementById('app-bar-button-container'));
    }, []);

    if (!appBar) return null;
    
    return ReactDOM.createPortal(props.children, appBar);
}