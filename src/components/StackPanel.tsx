import React from 'react'
import { makeStyles } from '@material-ui/core'

interface Props {
    direction?: 'row'
        | 'row-reverse'
        | 'column'
        | 'column-reverse';
    children?: React.ReactNode;
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: (props: Props) =>
            props.direction || 'column'
    }
}))

export default (props: Props) => {
    const styles = useStyles(props);

    return <div className={styles.root}>
        {props.children}
    </div>
}