/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflare.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'AI Video Editor',
  },
  // API rewrites disabled — demo mode runs fully on the frontend
  // async rewrites() {
  //   return {
  //     beforeFiles: [
  //       {
  //         source: '/api/:path*',
  //         destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
  //       },
  //     ],
  //   };
  // },
};

export default nextConfig;
