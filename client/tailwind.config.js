/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          sand: '#D8B995',
          dune: '#C49A70',
          sunset: '#E8C9A8',
          ivory: '#F3E5D2',
        },
        gold: {
          antique: '#B58A4F',
          light: '#D4AF37',
          shimmer: '#F7E7CE',
          dark: '#936C38',
        },
        oud: {
          deep: '#352014',
          espresso: '#24150F',
          rich: '#4A2E1F',
          accent: '#5A3826',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #24150F 0%, #352014 50%, #24150F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #B58A4F 0%, #D4AF37 50%, #936C38 100%)',
        'ivory-gradient': 'linear-gradient(180deg, #F3E5D2 0%, #E8C9A8 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(181, 138, 79, 0.35)',
        'luxury-card': '0 10px 30px -5px rgba(36, 21, 15, 0.1), 0 0 0 1px rgba(181, 138, 79, 0.15)',
        'luxury-float': '0 20px 40px -15px rgba(36, 21, 15, 0.25)',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
