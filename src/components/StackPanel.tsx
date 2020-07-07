import React from 'react'
import { makeStyles } from '@material-ui/core'
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    direction?: 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse';
    spacing?: number;
    animatePresence?: boolean;
    center?: boolean;
}

const childVariants = {
    initial: {
        opacity: 0,
        scale: 0
    },
    in: {
        opacity: 1,
        scale: 1
    },
    out: {
        opacity: 0,
        scale: 0
    }
};

const childTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.2
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: (props: Props) =>
            props.direction || 'column',
        '&> div + div': {
            marginLeft: (props: Props) => props.direction.startsWith('row') ? theme.spacing(props.spacing) : 0,
            marginTop: (props: Props) => props.direction.startsWith('column') ? theme.spacing(props.spacing) : 0
        },
        justifyContent: (props: Props) => props.center && 'center',
        alignItems: (props: Props) => props.center && 'center'
    }
}));

export default (props: Props & React.HTMLProps<HTMLDivElement>) => {
    let {
        animatePresence,
        direction,
        spacing,
        center,
        ...rest
    } = props;
    direction = direction || 'column';
    spacing = props.spacing === undefined
        ? 1
        : props.spacing;
    const styles = useStyles({ ...props, spacing, direction });

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];


    return <div {...rest} className={`${styles.root} ${props.className}`}>
        <AnimatePresence>
            {/* Filter out null children, to make adding/removing more intuitive */}
            {children.filter(c => !!c).map((c, i) => <motion.div key={i}
                initial="initial"
                animate="in"
                exit="out"
                variants={childVariants}
                transition={childTransition}>
                {c}
            </motion.div>)}
        </AnimatePresence>
    </div>
}