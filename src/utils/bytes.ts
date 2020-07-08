import { round } from "./math";

const descriptions = [
    'B',
    'KB',
    'MB',
    'GB',
    'TB'
];

export const friendlyBytes = (bytes: number, decimalPlaces: number=2) => {
    let size = 0;
    while (bytes >= 1024 && size < descriptions.length - 1) {
        bytes /= 1024;
        size += 1;
    }

    bytes = round(bytes, decimalPlaces);
    return `${bytes}${descriptions[size]}${bytes === 1 ? "" : "s"}`
}
