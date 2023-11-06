/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
};

module.exports = nextConfig;
