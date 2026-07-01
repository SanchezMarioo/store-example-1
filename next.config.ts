import type { NextConfig } from "next";

const rawBackendUrl =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

function toRemotePattern(rawUrl: string) {
  try {
    const u = new URL(rawUrl);
    return {
      protocol: u.protocol.replace(":", "") as "http" | "https",
      hostname: u.hostname,
      ...(u.port ? { port: u.port } : {}),
      pathname: "/**",
    };
  } catch {
    return { protocol: "http" as const, hostname: "localhost", port: "9000", pathname: "/**" };
  }
}

const isLocalBackend =
  rawBackendUrl.includes("localhost") || rawBackendUrl.includes("127.0.0.1");

const nextConfig: NextConfig = {
  images: {
    unoptimized: isLocalBackend,
    remotePatterns: [
      toRemotePattern(rawBackendUrl),
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
