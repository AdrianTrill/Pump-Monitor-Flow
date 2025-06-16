module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Badges
        badge: {
          normal: {
            border: '#1c8f45',
            bg: '#d3ecd3',
          },
          warning: {
            border: '#bf7600',
            bg: '#fff6b4',
          },
          critical: {
            border: '#b20000',
            bg: '#ffd3d3',
          },
        },
        // Banners
        banner: {
          red: {
            border: '#da5344',
            bg: '#fbedec',
          },
          orange: {
            border: '#bf7600',
            bg: '#fff6b4',
          },
          yellow: {
            border: '#b20000',
            bg: '#ffd3d3',
          },
          blue: {
            border: '#b20000',
            bg: '#ffd3d3',
          },
        },
        // Nav bar & graphs
        navy: '#182363',
        // Button
        button: '#3D5DE8',
        // Colored cards
        card: {
          yellow: {
            border: '#fde047',
            bg: '#fefce8',
          },
          blue: {
            border: '#bfdbfe',
            bg: '#eff6ff',
          },
          gray: {
            border: '#e5e7eb',
            bg: '#f9fafb',
          },
          green: {
            border: '#86efac',
            bg: '#f0fdf4',
          },
          red: {
            border: '#fca5a5',
            bg: '#fef2f2',
          },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}; 