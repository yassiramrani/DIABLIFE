/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
            // Soft blue & green palette
            primary: {
                DEFAULT: '#0D9488', // teal-600 (health focus)
                50: '#f0fdfa',
                100: '#ccfbf1',
                200: '#99f6e4',
                300: '#5eead4',
                400: '#2dd4bf',
                500: '#14b8a6',
                600: '#0d9488',
                700: '#0f766e',
                800: '#115e59',
                900: '#134e4a',
            },
            secondary: {
                DEFAULT: '#10B981', // emerald-500
                50: '#ecfdf5',
                100: '#d1fae5',
                200: '#a7f3d0',
                300: '#6ee7b7',
                400: '#34d399',
                500: '#10b981',
                600: '#059669',
                700: '#047857',
                800: '#065f46',
                900: '#064e3b',
            },
            accent: {
                DEFAULT: '#8B5CF6', // violet-500
            },
            background: '#F9FAFB', // warm gray
            surface: '#FFFFFF',
        },
        fontFamily: {
            sans: ['Inter', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }
