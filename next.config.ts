import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Configuración de Turbopack (Next.js 16 usa Turbopack por defecto)
  // Los path aliases ya están configurados en tsconfig.json y Turbopack los respeta automáticamente
  turbopack: {},
  // Configuración de webpack (solo se usa si se ejecuta con --webpack flag)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, './src/shared'),
      '@modules': path.resolve(__dirname, './src/modules'),
    };
    return config;
  },
};

export default nextConfig;
