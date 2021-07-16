export const heights = {
    1:'h-1',
    2:'h-2',
    4:'h-4',
    6:'h-6',
    8:'h-8',
    12:'h-12',
    24: 'h-24'
} as const;

export const widths = {
    1:'w-1',
    2:'w-2',
    4:'w-4',
    6:'w-6',
    8:'w-8',
    12:'w-12',
    24:'w-24'
} as const;

export type Size = keyof (typeof widths | typeof heights);