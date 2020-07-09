import React, { useRef, useState, useEffect } from 'react'
import { makeStyles, Typography } from '@material-ui/core';
import {round} from '../utils/math';

interface Props {
    percent: number;
    text?: string | number;

    radius?: number;
    stroke?: number;

    padding?: number;

    upSize?: boolean;
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
    const padding = props.padding || 4;
    
    const normalizedRadius = radius - stroke * 2;
    const size = normalizedRadius * 2 - padding*2;
    const circumference = normalizedRadius * Math.PI * 2;

    const strokeDashoffset = circumference - props.percent * circumference;

    const styles = useStyles();
    const textRef = useRef<SVGTextElement>();
    const [textScale, setTextScale] = useState(1);
    useEffect(() => {
        const textBBox = textRef.current.getBBox();
        const widthScale = textScale * size / textBBox.width;
        const heightScale = textScale * size / textBBox.height;
        let scale = Math.min(widthScale, heightScale);
        scale = round(scale, 2);

        if (scale > 1 && !props.upSize)
            scale = 1;

        setTextScale(scale);
    }, [props.text, textScale]);

    return <div className={styles.root}>
        <Typography gutterBottom={false}>
            <svg
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                className={styles.svg}>
                <circle
                    className={styles.circle}
                    stroke="white"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius} />
                <text ref={textRef}
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontSize={`${textScale}em`}>
                    {props.text}
                </text>
            </svg>
        </Typography>
    </div>
}