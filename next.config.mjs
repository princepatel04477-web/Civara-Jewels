/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  async redirects() {
    return [
      {
        source: '/viewings',
        destination: '/bespoke',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
