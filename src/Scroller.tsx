import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useOnMount } from "./hooks/lifeCycle";

export const ScrollToTopOnMount = (props) => {
    return <ScrollToOnMount x={0} y={0}/>;
}

export const ScrollToOnMount = (props: { x?: number, y?: number, delay?: number }) => {
    useOnMount(() => {
        setTimeout(() => window.scrollTo(props.x || 0, props.y || 0), props.delay || 0);
    });

    return <React.Fragment/>;
}

export const RestoreScroll = withRouter((props: RouteComponentProps<any>) => {
    return <div/>;
})

