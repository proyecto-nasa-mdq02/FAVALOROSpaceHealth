const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // El lockfile vacío de la carpeta padre hacía que Next vigilara todo el repo y tardara minutos en arrancar.
  outputFileTracingRoot: path.join(__dirname),
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
