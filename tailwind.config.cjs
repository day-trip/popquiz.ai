const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    mode: 'jit',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require("daisyui")
    ],
    daisyui: {
        themes: [
            {
                light: {

                    "primary": "#0ea5e9",

                    "secondary": "#334155",

                    "accent": "#059669",

                    "neutral": "#000000",

                    "base-100": "#f8fafc",

                    "info": "#3ABFF8",

                    "success": "#36D399",

                    "warning": "#FBBD23",

                    "error": "#F87272",
                },
            },
            {
                dark: {

                    "primary": "#0ea5e9",

                    "secondary": "#334155",

                    "accent": "#059669",

                    "neutral": "#000000",

                    "base-100": "#f8fafc",

                    "info": "#3ABFF8",

                    "success": "#36D399",

                    "warning": "#FBBD23",

                    "error": "#F87272",
                },
            },
        ],
    },
}