import { makeStyles } from '@material-ui/core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Routes from '../Routes';
import Layout from '../pages/_Layout';

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? '100vw' : '-100vw'
    }),
    in: {
        x: 0
    },
    out: (direction: number) => {
        console.log(direction)
        return {
            x: direction > 0 ? '-100vw' : '100vw'
        }
    },
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

const useStyles = makeStyles(theme => ({
    root: {
        height: 'calc(100vh - 48px)',
        width: '100vw',
        position: 'absolute',
        overflowY: 'auto',
        overflowX: 'hidden'
    }
}));

export const SlidePage = (props: { direction?: number, children: any }) => {
    const styles = useStyles();

    return <motion.div
        className={styles.root}
        custom={props.direction || 1}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
    >
        {props.children}
    </motion.div>
}

export default (props) => {
    const location = useLocation();
    const history = useHistory();
    const page = useMemo(() => {
        // Find a matching route. React-Router doesn't really work for this :/
        const route = Routes.filter(r => location.pathname.startsWith(r.prefix)
            && (location.pathname[r.prefix.length] === "/"
                || location.pathname.length === r.prefix.length))[0];
        if (!route)
            return null;

        const id = location.pathname
            .substr(route.prefix.length);

        return route.render(id);
    }, [location.pathname]);
    const direction = useMemo(() =>
        history.action === "POP"
            ? -1
            : 1,
        [location.pathname]);

    return <AnimatePresence custom={direction} initial={false}>
        <SlidePage key={location.pathname} direction={direction}>
            <Layout>
                {page}
            </Layout>
        </SlidePage>
    </AnimatePresence>;
}