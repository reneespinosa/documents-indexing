/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Necesario para Docker
  async rewrites() {
    // Solo en desarrollo local (no en Docker)
    if (process.env.NODE_ENV === 'development' && !process.env.DOCKER) {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;

