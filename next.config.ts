import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-parse'],
  allowedDevOrigins: ['192.168.0.233'],
  async redirects() {
    return [
      // Old /blog and /become-a-pilot URLs moved under the unified /guides hub (2026-07-07).
      { source: '/blog', destination: '/guides/dgca-exam-guides', permanent: true },
      { source: '/blog/:slug', destination: '/guides/dgca-exam-guides/:slug', permanent: true },
      { source: '/become-a-pilot', destination: '/guides/become-a-pilot', permanent: true },
      { source: '/become-a-pilot/:slug', destination: '/guides/become-a-pilot/:slug', permanent: true },
      // Truncated book URLs Google indexed from external links (2026-11-01). statusCode
      // rather than permanent so it's a 301, not a 308.
      { source: '/books/ic-joshi-aviation-met', destination: '/books/ic-joshi-aviation-meteorology', statusCode: 301 },
      { source: '/books/ic-joshi-aviation-met-total-q', destination: '/books/ic-joshi-aviation-meteorology', statusCode: 301 },
    ];
  },
};

export default nextConfig;
