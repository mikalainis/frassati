/** @type {import('next').NextConfig} */
const nextConfig = {
  // Builds a self-contained server (.next/standalone) for the Cloud Run container.
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/calendar",
        destination: "/gatherings",
        permanent: true
      }
    ];
  }
};
export default nextConfig;
