/** @type {import('next').NextConfig} */

const prodConfig = {
  async redirects() {
    console.log('AAAA');
    return [
      {
        source: '/',
        destination: '/documents',
        permanent: true,
      }
    ]
  },
}

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    emotion: true
  },
  ...(process.env.NODE_ENV === 'production' && prodConfig)
}

module.exports = nextConfig
