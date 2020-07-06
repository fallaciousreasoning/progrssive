import React from 'react'
import { makeStyles } from '@material-ui/core'

interface Props {
    direction?: 'row'
    | 'row-reverse'
    | 'column'
    | 'column-reverse';
    children?: React.ReactNode | React.ReactNode[];
    spacing?: number;
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: (props: Props) =>
            props.direction || 'column',
        '&> div + div': {
            marginLeft: (props: Props) => theme.spacing(props.spacing)
        }
    }
}))

export default (props: Props) => {
    const spacing = props.spacing === undefined
        ? 1
        : props.spacing;
    const styles = useStyles({ ...props, spacing });

    const children = Array.isArray(props.children)
        ? props.children
        : [props.children];

    return <div className={styles.root}>
        {children.map((c, i) => <div key={i}>
            {c}
        </div>)}
    </div>
}