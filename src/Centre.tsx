import { makeStyles } from "@material-ui/styles";
import * as React from 'react';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'center'
    }
});

export default props => {
    const styles = useStyles();

    return <div className={styles.root}>
        {props.children}
    </div>
}