/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/components/**/*.{vue,js,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/app.vue",
    "./app/error.vue"
  ],
  theme: {
    extend: {
      screens: {
        xs: '420px',
      },
      colors: {
        // Primary = Primary Brand Color (#243E75 - Dark Navy Blue for brand titles & headings)
        primary: {
          DEFAULT: "#00338a",
          dark: "#002566",
          hover: "#002566",
          light: "rgba(0, 51, 138, 0.15)",
        },
        secondary: {
          DEFAULT: "#f2850e",
          hover: "#d67207",
          light: "rgba(242, 133, 14, 0.15)",
        },
        // Tertiary = Subtle Emphasis / Subtitles / Errors (#B20310 - Crimson)
        tertiary: {
          DEFAULT: "#B20310",
          hover: "#8F020D",
          light: "rgba(178, 3, 16, 0.15)",
        },
        // Main Background Colors (Unchanged)
        'bg-primary': '#F2EAE0',
        bgPrimary: '#F2EAE0',
        'bg-secondary': '#FFFFFF',
        bgSecondary: '#FFFFFF',
        'bg-tertiary': '#FFF8E7',
        bgTertiary: '#FFF8E7',
      }
    },
  },
  plugins: [],
}
