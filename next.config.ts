import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  async redirects() {
    return [
      { source: "/favicon.ico", destination: "/icon.png", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/main", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
