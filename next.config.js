/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  async redirects() {
    return [
      // Legacy slugs collected by GSC before the cross-reference
      // system settled. July 2026.
      { source: "/actors/getty-ci", destination: "/actors/getty-conservation-institute", permanent: true },
      { source: "/essays/2026-04-draa-valley-corpus", destination: "/essays/draa-valley-corpus", permanent: true },
      { source: "/timeline/:slug", destination: "/timeline", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
