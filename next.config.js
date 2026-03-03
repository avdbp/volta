/** @type {import('next').NextConfig} */
//  trigger deploy
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
module.exports = nextConfig
