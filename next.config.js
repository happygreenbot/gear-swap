/** @type {import('next').NextConfig} */
const repoName = process.env.GITHUB_REPO || "gear-swap";

const nextConfig = {
  output: "export",
  basePath: `/${repoName}`,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig
