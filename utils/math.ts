export const round = (n: number, dps: number=1) => {
    const exponent = 10**dps;
    return Math.round(n * exponent) / exponent;
}