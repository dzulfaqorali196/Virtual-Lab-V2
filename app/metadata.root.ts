import { Metadata } from 'next'
import { metadata as baseMetadata } from './metadata'

export const metadata: Metadata = {
  ...baseMetadata,
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
} 