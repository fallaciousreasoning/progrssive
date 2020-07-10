import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Layout from '../pages/_Layout';
import Routes from '../Routes';
import SlidePage from './SlidePage';

export default () => {
    const location = useLocation();
    const history = useHistory();
    const page = useMemo(() => {
        // Find a matching route. React-Router doesn't really work for this :/
        const route = Routes.filter(r => location.pathname.startsWith(r.prefix)
            && (location.pathname[r.prefix.length] === "/"
                || location.pathname.length === r.prefix.length))[0];
        if (!route) {
            // Fallback to the streams page when no route matches.
            history.replace('/stream');
            return null;
        }

        return route;
    }, [location, history]);

    const Container = page && page.noLayout ? React.Fragment : Layout;

    return <SlidePage>
        {page && <Container key={page.prefix}>
            <page.component />
        </Container>}
    </SlidePage>;
}