import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Nur Entwicklung: erlaubt den Zugriff auf den Dev-Server vom Handy im Heimnetz
  // (z. B. http://192.168.178.20:3000). Ohne das blockiert Next die /_next-Skripte,
  // die Seite wird nicht hydriert und das mobile Menü reagiert nicht.
  allowedDevOrigins: ["192.168.*.*"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
