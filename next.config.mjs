/** @type {import('next').NextConfig} */
const nextConfig = {
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
