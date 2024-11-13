/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    domains: ['images.unsplash.com'],
  },
  // Menambahkan konfigurasi untuk API docs
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/api-docs',
        permanent: true,
      },
    ]
  },
  // Konfigurasi untuk swagger-ui-react
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    return config
  },
}

module.exports = nextConfig