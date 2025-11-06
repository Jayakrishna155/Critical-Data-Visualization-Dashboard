/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '1mb'
    }
  },
  reactStrictMode: true,
  compiler: {
    reactRemoveProperties: true,
    removeConsole: process.env.NODE_ENV === 'production'
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;

