import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Optimizaciones de compilación
  // swcMinify ya no es necesario en Next.js 16 - SWC está habilitado por defecto
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Configuración de imágenes
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
    formats: ['image/avif', 'image/webp'],
  },
  
  // Optimizaciones de rendimiento
  experimental: {
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
  
  // Configuración de Turbopack (Next.js 16 usa Turbopack por defecto)
  // Los path aliases ya están configurados en tsconfig.json y Turbopack los respeta automáticamente
  turbopack: {
    // Optimizaciones de Turbopack para desarrollo más rápido
    resolveAlias: {
      '@shared': path.resolve(__dirname, './src/shared'),
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
  
  // Configuración de webpack (solo se usa si se ejecuta con --webpack flag)
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@shared': path.resolve(__dirname, './src/shared'),
      '@modules': path.resolve(__dirname, './src/modules'),
    };
    
    // Optimizaciones para desarrollo más rápido
    if (dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
