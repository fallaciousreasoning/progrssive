interface Stylish {
    opacity?: number;
    x?: string;
    y?: string;
    scale?: number;
}
export const mapStyles = (styles) => {
    return {
        opacity: styles.opacity,
        transform: `scale(${styles.scale})`
    }
}