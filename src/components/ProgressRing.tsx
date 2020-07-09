import React from 'react'
import { makeStyles, Typography } from '@material-ui/core';

interface Props {
    percent: number;
    text?: string;

    radius?: number;
    stroke?: number;
}

const useStyles = makeStyles(theme => ({
    root: {
        height: theme.spacing(5),
        width: theme.spacing(5)
    },
    svg: {
        width: '100%',
        height: '100%'
    },
    circle: {
        transform: 'rotate(0.75turn)',
        transformOrigin: '50% 50%',
        stroke: theme.palette.secondary.main
    }
}));

export default (props: Props) => {
    const stroke = props.stroke || 1;
    const radius = props.radius || 48;

    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * Math.PI * 2;

    const strokeDashoffset = circumference - props.percent * circumference;
    const styles = useStyles();

    return <div className={styles.root}>
        <Typography gutterBottom={false}>
            <svg
                viewBox={`0 0 ${radius*2} ${radius*2}`}
                className={styles.svg}>
                <circle
                    className={styles.circle}
                    stroke="white"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    stroke-width={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}/>
                {props.text && <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle">
                    {props.text}
                </text>}
            </svg>
        </Typography>
    </div>
}