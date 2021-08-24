import React, { useRef, useState, useEffect } from 'react'
import { round } from '../utils/math';

interface Props {
    percent: number;
    text?: string | number;

    radius?: number;
    stroke?: number;

    padding?: number;

    upSize?: boolean;
}

const ProgressRing = (props: Props) => {
    const stroke = props.stroke || 2;
    const radius = props.radius || 19;
    const padding = props.padding || 2;

    const normalizedRadius = radius - stroke * 2;
    const size = normalizedRadius * 2 - padding * 2;
    const circumference = normalizedRadius * Math.PI * 2;

    const strokeDashoffset = circumference - props.percent * circumference;

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
    }, [props.text]);

    return <div className="w-10 h-10 text-base">
        <svg
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            className="w-full h-full text-foreground fill-current">
            <circle
                className="text-secondary opacity-50 stroke-current"
                stroke="white"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius} />
            <circle
                className="stroke-current text-secondary origin-center"
                stroke="white"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset, transform: "rotate(0.75turn)" }}
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
    </div>
};

export default ProgressRing;