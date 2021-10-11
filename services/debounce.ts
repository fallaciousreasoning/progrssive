export const debounce = (f: (...args) => void, time: number) => {
    let timeout;

    const invoke = (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => f(...args), time);
    }
    
    return invoke;
}