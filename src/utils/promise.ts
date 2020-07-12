export const delay = (by: number) => new Promise(accept => {
    setTimeout(accept, by);
});

export const delayResult = <T>(by: number) => {
    return async (result: T) => {
        await delay(by);
        return result;
    }
}

export const resolvable = <T = void>() => {
    let resolve: (value?: T) => void;
    let reject: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });

    return {
        resolve,
        reject,
        promise
    };
}