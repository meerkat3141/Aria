/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                earth: {
                    bg: '#EADCC9',
                    primary: '#9DB68B',
                    dark: '#2C3E50',
                    light: '#F5F5DC'
                }
            },
            fontFamily: {
                sans: ['Ranade', 'sans-serif'],
                serif: ['Ranade', 'serif'],
            }
        },
    },
    plugins: [],
}
