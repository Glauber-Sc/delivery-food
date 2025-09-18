// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#fff7ed',
//           100: '#ffedd5',
//           200: '#fed7aa',
//           300: '#fdba74',
//           400: '#fb923c',
//           500: '#DF2C2D',
//           600: '#ea580c',
//           700: '#c2410c',
//           800: '#9a3412',
//           900: '#7c2d12'
//         },
//         success: {
//           50: '#ecfdf5',
//           100: '#d1fae5',
//           200: '#a7f3d0',
//           300: '#6ee7b7',
//           400: '#34d399',
//           500: '#10b981',
//           600: '#059669',
//           700: '#047857',
//           800: '#065f46',
//           900: '#064e3b'
//         }
//       }
//     },
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FEF4F4',
          100: '#FDE8EA',
          200: '#FAC6CA',
          300: '#F7A5AB',
          400: '#F27780',
          500: '#EA1D2C', // iFood Red (oficial)
          600: '#D31A28',
          700: '#B01621',
          800: '#8C111A',
          900: '#690D14'
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b'
        }
      }
    },
  },
  plugins: [],
}
