/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF770F",
        secondary: "#9C9A9A",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",

        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",

        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",

        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Opcional: Si quieres usar los charts como colores (por ejemplo para gráficos o badges)
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"]
      },
    },
    screens: {
      xs: "420px",
      ss: "580px",
      sm: "768px",
      md: "1060px",
      lg: "1440px",
      xl: "1800px"
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        ".container": {
          "@apply w-[90%] sm:w-full sm:px-8":
            {},
        },
        ".flexCenter": {
          "@apply flex justify-center items-center":
            {},
        },
        ".flexStart": {
          "@apply flex justify-center items-start":
            {},
        },
        ".h1": {
          "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
            {},
        },
        ".h2": {
          "@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
            {},
        },
        ".h3": {
          "@apply text-[1rem] font-bold sm:text-[20px] mb-6 sm:mb-14": {},
        },
        ".h4": {
          "@apply text-[2rem] leading-normal": {},
        },
        ".h5": {
          "@apply text-2xl leading-normal": {},
        },
        ".h6": {
          "@apply font-semibold text-lg leading-8": {},
        },
        ".body-1": {
          "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
            {},
        },
        ".btn-base": {
          "@apply min-w-[250px] sm:min-w-[270px] rounded-2xl font-semibold py-2 px-8 sm:px-16": {},
        },
        ".btn-transparent": {
          "@apply transition ease-in-out bg-transparent hover:bg-primary duration-300": {},
        },
        ".bordered": {
          "@apply border-solid border-2 border-primary": {},
        },
        ".btn-auto":{
          "@apply min-w-0 rounded-2xl font-semibold py-2 px-8 sm:px-16": {},
        },
        ".btn-icon":{
          "@apply text-white bg-orange-600 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-full text-sm p-1.5 text-center inline-flex items-center me-2 dark:bg-orange-400 dark:hover:bg-orange-600 dark:focus:ring-orange-600": {},
        }

      });
      addUtilities({
        // ".news-modal-overlay": {
        //   "@apply fixed right-0 left-0 top-[50%] flex items-center justify-center min-h-[550px] bg-white shadowModal mx-auto rounded-2xl w-[94%] sm:w-[550px] z-40": {},
        // },
        ".news-modal-overlay": {
          "@apply fixed inset-x-0 top-[calc(50%+1rem)] sm:top-[calc(50%+3.5rem)] translate-y-[-50%] flex items-center justify-center min-h-[550px] bg-white shadowModal mx-auto rounded-2xl w-[94%] sm:w-[550px] z-40": {},
        },
        ".news-modal-body": {
          "@apply w-[90%] flex flex-col p-[20px]": {},
        },
        ".topV": {
          "transform": "translateY(-50%)",
        },
        ".shadowHeader": {
          "box-shadow": "0 4px 8px 0 rgba(0,0,0,0.25)",
        },
        ".shadowFooter": {
          "box-shadow": "0 -4px 6px 0 rgba(0,0,0,0.10)",
        },
        ".shadowModal": {
          "box-shadow": "0 6px 8px 0 rgba(0,0,0,0.25)",
        },
      });
    }),
  ],
}
