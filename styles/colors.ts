export const colors = {
    amber: {
        light: '#ffa000',
        dark: '#ffc107',
    },
    blue: {
        light: '#1976d2',
        dark: '#2196f3',
    },
    blueGrey: {
        light: '#455a64',
        dark: '#607d8b'
    },
    cyan: {
        light: '#0097a7',
        dark: '#00bcd4',
    },
    green: {
        light: '#388e3c',
        dark: '#4caf50',
    },
    orange: {
        light: '#f57c00',
        dark: '#ff9800',
    },
    purple: {
        light: '#7b1fa2',
        dark: '#9c27b0',
    },
    red: {
        light: '#d32f2f',
        dark: '#f44336',
    },
    deepPurple: {
        light: '#512da8',
        dark: '#673ab7',
    },
    pink: {
        light: '#c2185b',
        dark: '#e91e63',
    },
    teal: {
        light: '#00796b',
        dark: '#009688',
    },
    yellow: {
        light: '#fbc02d',
        dark: '#ffeb3b',
    },
    lightGreen: {
        light: '#689f38',
        dark: '#8bc34a',
    },
    lightBlue: {
        light: '#0288d1',
        dark: '#03a9f4',
    },
    lime: {
        light: '#afb42b',
        dark: '#cddc39',
    }
} as const;

export const grey = {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    500: '#9e9e9e',
    700: '#616161',
    900: '#212121'
};

export type AccentColor = keyof typeof colors;
export const accentColors = Object.keys(colors) as AccentColor[];

export const getColorForTheme = (color: AccentColor, theme: 'light' | 'dark') => {
    return colors[color]?.[theme] ?? colors.green.light;
}