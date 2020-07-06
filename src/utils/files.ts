interface Options {
    accept: string[];
}

const defaultOptions = {
    accept: []
}

export const pickFile = async (options?: Options): Promise<File> => {
    options = { ...defaultOptions, ...options };

    const input = document.createElement('input');
    input.setAttribute('type', 'file');

    const accept = options.accept.join(',');
    input.setAttribute('accept', accept);

    let resolvePromise;
    const promise = new Promise<File>((resolve) => {
        resolvePromise = resolve;
    });

    input.addEventListener('change', e => {
        const files: FileList = e.target['files'];
        resolvePromise(files[0]);
    });
    
    document.body.appendChild(input);
    input.click();
    input.remove();

    return promise;
}

export const getFileText = (file: File): Promise<string> => {
    const reader = new FileReader();

    let resolvePromise;
    let rejectPromise;
    const promise = new Promise<string>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });

    reader.addEventListener('loadend', event => {
        resolvePromise(event.target.result);
    });

    reader.addEventListener('error', event => {
        rejectPromise(event.target.error);
    });
    reader.readAsText(file);

    return promise;
}

export const downloadTextFile = (text: string, filename: string, type = "text/plain") => {
    const a = document.createElement('a');
    const href = `data:${type};charset=utf-8,${encodeURIComponent(text)}`;
    a.setAttribute('href', href);
    a.setAttribute('download', filename);

    document.body.appendChild(a);
    a.click();
    a.remove();
}