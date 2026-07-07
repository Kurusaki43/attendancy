import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Ship these as plain node_modules requires instead of bundling them — both ship native
  // (.node) bindings that the bundler can't trace correctly, which breaks at runtime otherwise.
  serverExternalPackages: ['@node-rs/argon2', '@prisma/client'],
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
