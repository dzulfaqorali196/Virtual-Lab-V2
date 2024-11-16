import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Virtual Physics Lab - Pendulum Experiment',
  description: 'Interactive virtual physics laboratory for pendulum experiments and learning',
  icons: {
    icon: [
      {
        url: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
    shortcut: [{ url: '/icon.svg' }],
    apple: { url: '/icon.svg' }
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  themeColor: '#000000',
} 