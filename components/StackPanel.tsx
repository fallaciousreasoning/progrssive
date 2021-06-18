import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AnimatePresence, motion, Variant, Transition } from 'framer-motion';

interface Props {
    direction?: 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse';
    alignItems?: 'start' | 'end' | 'center' | 'stretch';
    justifyContent?: 'start' | 'end' | 'center' | 'stretch';

    spacing?: number;
    animatePresence?: boolean;
    center?: boolean;

    variants?: {
        initial?: Variant;
        in?: Variant;
        out?: Variant;
    },

    transition?: Transition;
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
        justifyContent: (props: Props) => props.center ? 'center' : props.justifyContent,
        alignItems: (props: Props) => props.center ? 'center' : props.alignItems
    }
}));

export default (props: Props & React.HTMLProps<HTMLDivElement>) => {
    let {
        animatePresence,
        direction,
        spacing,
        center,
        alignItems,
        justifyContent,
        variants,
        transition,
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

    const Container = animatePresence ? AnimatePresence : React.Fragment;

    return <div {...rest} className={`${styles.root} ${props.className}`}>
        <Container>
            {/* Filter out null children, to make adding/removing more intuitive */}
            {children.filter(c => !!c).map((c, i) => <motion.div key={c['key'] || c['id'] || i}
                initial="initial"
                animate="in"
                exit="out"
                variants={props.variants || childVariants}
                transition={transition || childTransition}>
                {c}
            </motion.div>)}
        </Container>
    </div>
}