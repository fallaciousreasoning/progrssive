import * as React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useStore } from './hooks/store';
import { useProfile } from './hooks/profile';
import { useState, useEffect, useCallback } from 'react';
import { getAllId } from './api/streams';
import StreamViewer from './StreamViewer';
import EntryViewer from './EntryViewer';
import { Route, RouteComponentProps, withRouter } from 'react-router';
import { AppBar } from '@material-ui/core';
import { SwipeableView } from './components/SwipeableView';

export interface AppRoute {
    prefix: string;
    render: (id?: string, active?: boolean) => React.ReactNode;
}

interface Props extends RouteComponentProps<any> {
    routes: AppRoute[];
}

interface RouteSetterProps {
    prefix: string;
    setActive: (prefix: string, id: string) => void;
}

const RouteSetter = (props: RouteSetterProps) => {
    return <Route path={`${props.prefix}:id*`}
        component={(p: RouteComponentProps) => {
            const location = p.location.pathname;
            const id = location.substr(props.prefix.length);

            props.setActive(props.prefix, id);
            return null;
        }}>
    </Route>
}

export default withRouter((props: Props) => {
    const store = useStore();
    const [activeSlide, setActiveSlide] = useState(0);

    const setActive = useCallback((prefix: string, id: string) => {
        store.current[prefix] = id;

        const slideIndex = props.routes.findIndex(r => r.prefix === prefix);
        setActiveSlide(slideIndex);
    }, [props.routes, setActiveSlide]);

    return <>
        <SwipeableView
            activeIndex={activeSlide}
            onSwiped={(n) => {
            if (n === activeSlide) return;

            const prefix = props.routes[n].prefix;
            const path = store.current[prefix];

            setActiveSlide((n + 1) % 2);
            props.history.push(`${prefix}${path || ''}`)
        }}>
            {props.routes.map((r, i) => <div
                style={{ width: '100vw', height: '90vh', overflow: 'hidden auto' }}
                key={r.prefix}>
                {r.render(store.current[r.prefix], activeSlide === i)}
            </div>)}
        </SwipeableView>
        {props.routes.map(r => <RouteSetter key={r.prefix} prefix={r.prefix} setActive={setActive}/>)}
    </>
});