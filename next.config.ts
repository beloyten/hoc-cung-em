import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  experimental: {
    // Server Actions đã stable trong Next 14+, không cần flag
  },
}

export default withSentryConfig(nextConfig, {
  org: "hoc-cung-em",
  project: "hoc-cung-em",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
})

