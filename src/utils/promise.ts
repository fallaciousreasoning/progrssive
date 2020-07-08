export const delay = (by: number) => new Promise(accept => {
    setTimeout(accept, by);
});

export const delayResult = <T>(by: number) => {
    return async (result: T) => {
        await delay(by);
        return result;
    }
}