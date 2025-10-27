/** @type {import('tailwindcss').Config} */

const { property } = require('lodash');
const defaultTheme = require('tailwindcss/defaultTheme');

// Custom color with css variable color in __theme_color.scss
function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '10px',
        '2xl': '128px',
      },
    },

    extend: {
      fontFamily: {
        mona: ['"Mona Sans"', 'sans-serif'],
      },
      colors: {
        portal: {
          primaryLiving: '#982220',
          primaryMainAdmin: '#25793A',
          primaryButtonAdmin: '#FFD14B',
          textColorAdmin: '#575757',
          textTitleChart: '#404040',
          backgroud: '#F6F8F9',
          card: '#FFFFFF',
          border: '#E6E9EC',
          greenBg: '#BCF0D2',
          greenText: '#1E854A',
          black: '#111820',
          blackGray: '#404040',
          approveColor100: '#27AE60',
          approveColor50: '#E6F9EE',
          rejectColor100: '#961212',
          rejectColor50: '#F6B6B6',
          newColor100: '#C8660E',
          newColor50: '#FEF4EC',
          blue100: '#0F50A9',
          blue50: '#E2EEFE',
          black: '#111820',
          yellow: {
            DEFAULT: '#FFD14B',
            1: '#FBE5AB',
            2: '#FCF4DD',
          },
          gray: {
            DEFAULT: '#F5F5F5',
            1: '#F2F4F8',
            2: '#DEE3ED',
            3: '#D4D4D4',
            4: '#696969',
            5: '#6E7987',
            6: '#555555',
            7: '#444444',
            border: '#D9D9D9',
          },
          purple: {
            1: '#D8BFD8',
            2: '#BA55D3',
          },
          orange: {
            1: '#FEF4EC',
            DEFAULT: '#F2994A',
            4: '#C8660E',
          },
          green: {
            1: '#E6F9EE',
            2: '#27AE60',
            4: '#1E854A',
          },
          red: {
            DEFAULT: '#A80707',
            1: '#FCE4E4',
            2: '#EB5757',
            3: '#A01D25',
            4: '#961212',
          },
          amenityIn: '#C7C3E5',
          amenityOut: '#97B18E',
        },

        primary: {
          DEFAULT: customColors('--c-primary-default'),
          50: customColors('--c-primary-50'),
          100: customColors('--c-primary-100'),
          200: customColors('--c-primary-200'),
          300: customColors('--c-primary-300'),
          400: customColors('--c-primary-400'),
          500: customColors('--c-primary-500'),
          6000: customColors('--c-primary-600'),
          700: customColors('--c-primary-700'),
          800: customColors('--c-primary-800'),
          900: customColors('--c-primary-900'),
        },

        cyan: {
          DEFAULT: customColors('--c-cyan'),
        },

        yellow: {
          DEFAULT: customColors('--c-yellow'),
          200: customColors('--c-yellow-200'),
          800: customColors('--c-yellow-800'),
        },

        green: {
          DEFAULT: customColors('--c-green'),
        },

        'pmh-text': {
          DEFAULT: customColors('--c-neutral-550'),
        },
        'property-item-border': {
          DEFAULT: customColors('--c-yellow'),
        },
        'property-item-background': {
          DEFAULT: customColors('--c-cyan')({ opacityValue: 0.4 }),
          selected: customColors('--c-yellow'),
        },

        'header-bg': {
          DEFAULT: customColors('--bg-header'),
        },

        secondary: {
          50: customColors('--c-secondary-50'),
          100: customColors('--c-secondary-100'),
          200: customColors('--c-secondary-200'),
          300: customColors('--c-secondary-300'),
          400: customColors('--c-secondary-400'),
          500: customColors('--c-secondary-500'),
          6000: customColors('--c-secondary-600'),
          700: customColors('--c-secondary-700'),
          800: customColors('--c-secondary-800'),
          900: customColors('--c-secondary-900'),
        },
        neutral: {
          0: customColors('--c-neutral-0'),
          50: customColors('--c-neutral-50'),
          100: customColors('--c-neutral-100'),
          200: customColors('--c-neutral-200'),
          300: customColors('--c-neutral-300'),
          400: customColors('--c-neutral-400'),
          500: customColors('--c-neutral-500'),
          6000: customColors('--c-neutral-600'),
          700: customColors('--c-neutral-700'),
          800: customColors('--c-neutral-800'),
          900: customColors('--c-neutral-900'),
          1000: customColors('--c-neutral-1000'),
        },
        primaryColor: '#0D263B',
        danger: '#EF4444',
      },
      screens: {
        'desktop': '768px',
        'laptop-lg': {min: '768px', max: '1899.98px'},
        'laptop-md': {min: '768px', max: '1619.98px'},
        'laptop-sm': {min: '768px', max: '1439.98px'},
        'tablet-lg': {min: '768px', max: '1365.98px'},
        'tablet-md': {min: '768px', max: '1079.98px'},
        'mobile': {max: '767.98px'}
      },
      fontSize: {
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.75rem'
      },
      lineHeight: {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2',
        1.4: 'calc(35/24)',
        1.5: 'calc(28/18)',
        3: '.75rem',      // 12px
        4: '1rem',        // 16px
        5: '1.25rem',     // 20px
        6: '1.5rem',      // 24px
        7: '1.75rem',     // 28px
        8: '2rem',        // 32px
      },
      spacing: {
        15: '3.75rem', // = 60px
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
    require('@tailwindcss/aspect-ratio'),
  ],
};
