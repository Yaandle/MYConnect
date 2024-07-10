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
      ],
    },
  };
  
  export default nextConfig;