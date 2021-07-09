import { motion, AnimatePresence } from "framer-motion";
import { makeStyles } from "@material-ui/core";
import { Suspense, useMemo } from "react";
import Centre from "./Centre";
import React from 'react'
import { useRouter } from "next/router";
import LoadingSpinner from "./LoadingSpinner";

const pageVariants = {
    initial: (direction: number) => ({
        x: direction > 0 ? '100vw' : '-100vw'
    }),
    in: {
        x: 0
    },
    out: (direction: number) => ({
        x: direction > 0 ? '-100vw' : '100vw'
    })
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.2
};

const useStyles = makeStyles(theme => ({
    root: {
        height: `calc(100vh - 48px)`,
        width: '100vw',
        position: 'absolute',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    '@global': {
        'body': {
            background: `${theme.palette.background.default}`
        },
        '.page-loader': {
            marginTop: theme.spacing(1)
        }
    }
}));

const pageLoadingIndicator = <Centre className="page-loader">
    <LoadingSpinner />
</Centre>

const SlidePage = (
    props: {
        className?: string,
        children: React.ReactNode | undefined,
        initial?: boolean
    }
) => {
    const styles = useStyles();
    const router = useRouter();

    // TODO: Come back to this when stuff works again.
    const direction = useMemo(() => 1,
        [router.pathname]);

    const children = (Array.isArray(props.children)
        ? props.children
        : [props.children]).filter(c => c);

    return <AnimatePresence custom={direction} initial={!!props.initial}>
        {children.map((child, index) => <motion.div
            className={props.className || styles.root}
            custom={direction || 1}
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            key={child['key'] || child['id'] || index}
            transition={pageTransition}
        >
            <Suspense fallback={pageLoadingIndicator}>
                {child}
            </Suspense>
        </motion.div>)}

    </AnimatePresence>
};

export default SlidePage;