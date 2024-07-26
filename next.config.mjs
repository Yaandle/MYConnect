/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: '*.convex.cloud',
              port: '',
              pathname: '/api/storage/**',
          },
          {
              protocol: 'https',
              hostname: 'images.unsplash.com',
              port: '',
              pathname: '/photo-**',
          },
      ],
  },
};

export default nextConfig;
