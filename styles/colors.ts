export const colors = {
    amber: {
        light: '#ffc107',
        dark: '#ffa000',
    },
    blue: {
        light: '#2196f3',
        dark: '#1976d2',
    },
    blueGrey: {
        light: '#607d8b',
        dark: '#455a64',
    },
    cyan: {
        light: '#00bcd4',
        dark: '#0097a7',
    },
    green: {
        light: '#4caf50',
        dark: '#388e3c',
    },
    orange: {
        light: '#ff9800',
        dark: '#f57c00',
    },
    purple: {
        light: '#9c27b0',
        dark: '#7b1fa2',
    },
    red: {
        light: '#f44336',
        dark: '#d32f2f',
    },
    deepPurple: {
        light: '#673ab7',
        dark: '#512da8',
    },
    pink: {
        light: '#e91e63',
        dark: '#c2185b',
    },
    teal: {
        light: '#009688',
        dark: '#00796b',
    },
    yellow: {
        light: '#ffeb3b',
        dark: '#fbc02d',
    },
    lightGreen: {
        light: '#8bc34a',
        dark: '#689f38',
    },
    lightBlue: {
        light: '#03a9f4',
        dark: '#0288d1',
    },
    lime: {
        light: '#cddc39',
        dark: '#afb42b',
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

export const parseHexColor = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

export const isDark = (hex: string) => {
    const { r, g, b} = parseHexColor(hex);
    return (r * .299 + g * .587 + b * .114) < 128;
}

export const getContrastingColor = (hex: string) => isDark(hex) ? 'white' : 'black';