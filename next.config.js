/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  webpack: (config) => {
    config.experiments = {
      layers: true,
      asyncWebAssembly: true,
    };
    return config;
  },
};

module.exports = nextConfig;
