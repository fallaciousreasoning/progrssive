interface Options {
    accept: string[];
}

const defaultOptions = {
    accept: []
}

export const pickFile = async (options?: Options) => {
    options = { ...defaultOptions, ...options };

    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    const accept = options.accept.join(',');
    input.setAttribute('accept', accept);

    let resolvePromise;
    const promise = new Promise((resolve) => {
        resolvePromise = resolve;
    });

    input.addEventListener('change', e => {
        const files: FileList = e.target['files'];
        input.remove();
        resolvePromise(files[0]);
    });

    document.body.appendChild(input);
    input.click();

    return promise;
}