/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dieycvogftvfoncigvtl.supabase.co',
        pathname: '/storage/v1/object/public/imagens/**',
      },
    ],
  },
};

module.exports = nextConfig;
