export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#16161A',
        inkLight: '#23232A',
        paper: '#F7F4ED',
        salmon: '#E8623A',
        salmonDark: '#C84F2C',
        nori: '#2F4A3C',
        wasabi: '#B8D178',
        shoyu: '#3A2A1F',
        alert: '#C0392B',
        station: {
          fria: '#5B8C7B',
          caliente: '#E8623A',
          empacar: '#D4A857',
          repartir: '#5B7DB1',
          rappi: '#9B5DE5',
        },
        status: {
          recibido: '#9CA3AF',
          cocinando: '#E8623A',
          empacando: '#D4A857',
          repartiendo: '#5B7DB1',
          entregado: '#2F4A3C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
