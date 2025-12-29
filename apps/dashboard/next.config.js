/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    LITELLM_BASE_URL: process.env.LITELLM_BASE_URL || 'http://litellm:4000/v1',
    LITELLM_API_KEY: process.env.LITELLM_API_KEY || '',
  },
}

module.exports = nextConfig

