import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Entregables (Issue #8): archivos de hasta 10 MB + margen del FormData.
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
