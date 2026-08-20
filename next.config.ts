import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Video uploads go through middleware/proxy; default 10MB truncates FormData.
    proxyClientMaxBodySize: "200mb",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/arts-crafts", destination: "/invitations", permanent: true },
      { source: "/design", destination: "/invitations", permanent: true },
      { source: "/design-studio", destination: "/invitations", permanent: true },
      { source: "/web", destination: "/websites", permanent: true },
      { source: "/branding", destination: "/services", permanent: true },
      { source: "/marketing", destination: "/services", permanent: true },
      { source: "/creative", destination: "/invitations", permanent: true },
    ];
  },
};

export default nextConfig;
