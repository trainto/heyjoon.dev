/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

if (process.env.NODE_ENV === 'development') {
  nextConfig.output = undefined;
  nextConfig.rewrites = async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8080/:path*',
    },
  ];
}

export default nextConfig;
