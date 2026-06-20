/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // placeholder service used for seed images — swap for S3/CDN before launch
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
};

export default nextConfig;
