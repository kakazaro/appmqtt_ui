// import { DefaultTheme } from '@react-navigation/native';
// import { configureFonts } from 'react-native-paper';

let colors = {
    // Dark theme
    dp00: '#121212',
    dp01: '#1D1D1D',
    dp02: '#212121',
    dp03: '#242424',
    dp04: '#272727',
    dp06: '#2C2C2C',
    dp08: '#2D2D2D',
    dp12: '#323232',
    dp16: '#353535',
    dp24: '#373737',

    // Text
    primaryText: '#444444',
    secondaryText: '#747474',

    // Accent color
    ap50: '#292929',
    ap100: '#DBB2FF',
    ap200: '#BB86FC',
    dp300: '#985EFF',

    seekerColor: '#D32F2F',

    // Color
    bg1: '#F2F2F2',
    bg2: '#e2e2e2',

    bgDanger: '#c15d5d',

    LAKE_THUN: '#47bede',
    KIKORANGI_BLUE: '#344bc4',
    FADING_NIGHT: '#317ad4',
    SUNBURST: '#fac187',
    SUNBURST_LIGHT: 'rgba(250,193,135,0.2)',
    BEER: '#f7891b',
    PHILIPPINE_ORANGE: '#ff7300',
    SKIRRET_GREEN: '#54c242',
    STADIUM_LAWN: '#99ff5e',
    REDDISH: '#c44343',
    FUSION_RED: '#ff5e5e',
    KANZO_ORANGE: '#ff8938',
    EASTER_PURPLE: '#c46efa',
    VIVID_SKY_BLUE: '#00d2ff',

    DARK_SOULS: '#a3a3a3',
    UNICORN_SILVER: '#e8e8e8',
    MORE_THAN_A_WEEK: '#8d8d8d',
    SILVER_POLISH: '#c6c6c6',


};

colors = {
    ...colors,
    normal: colors.SKIRRET_GREEN,
    alarm: colors.PHILIPPINE_ORANGE,
    fault: colors.seekerColor,
    offline: colors.DARK_SOULS,
};

const size = {
    // Screen
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1200,
    maxWidth: 1366,
};

export { size, colors };

// const fontConfig = {
//     web: {
//         regular: {
//             fontFamily: 'sans-serif',
//             fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'sans-serif-medium',
//             fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'sans-serif-light',
//             fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'sans-serif-thin',
//             fontWeight: 'normal',
//         },
//     },
//     ios: {
//         regular: {
//             fontFamily: 'sans-serif',
//             fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'sans-serif-medium',
//             fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'sans-serif-light',
//             fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'sans-serif-thin',
//             fontWeight: 'normal',
//         },
//     },
//     android: {
//         regular: {
//             fontFamily: 'sans-serif',
//             fontWeight: 'normal',
//         },
//         medium: {
//             fontFamily: 'sans-serif-medium',
//             fontWeight: 'normal',
//         },
//         light: {
//             fontFamily: 'sans-serif-light',
//             fontWeight: 'normal',
//         },
//         thin: {
//             fontFamily: 'sans-serif-thin',
//             fontWeight: 'normal',
//         },
//     }
// };

// export default {
//     ...DefaultTheme,
//     // colors: {
//     //     ...DefaultTheme.colors,
//     //     // primary: color.PHILIPPINE_ORANGE,
//     //     // accent: '#ffffff',
//     //     // background: '#ffffff',
//     //     // text: color.primaryText,
//     //     // onSurface: color.secondaryText,
//     // },
//     fonts: configureFonts(fontConfig),
//     animation: {
//         scale: 1.0,
//     },
//     definedColor: color
// };