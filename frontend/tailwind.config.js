module.exports = {
  theme: {
    extend: {
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'ripple': 'ripple 0.6s ease-out forwards',
        'progress': 'progress 2s ease-in-out infinite',
        'success-check': 'success-check 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        ripple: {
          '0%': { width: '0px', height: '0px', opacity: '0.5' },
          '100%': { width: '500px', height: '500px', opacity: '0' },
        },
        progress: {
          '0%': { width: '0%' },
          '50%': { width: '70%' },
          '100%': { width: '100%' },
        },
        'success-check': {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0)', opacity: '1' },
        },
      },
      screens: {
        'xs': '475px',
      },
    },
  },
}