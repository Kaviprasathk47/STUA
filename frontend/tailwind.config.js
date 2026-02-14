/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#10B981", // Example replacement if original had this, or just empty if it was default
                secondary: "#64748B",
            },
        },
    },
    plugins: [],
}
