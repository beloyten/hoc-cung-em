import type { NextConfig } from "next"
import { withSentryConfig } from "@sentry/nextjs"
import withSerwistInit from "@serwist/next"

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: true,
})

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
}

export default withSentryConfig(withSerwist(nextConfig), {
  org: "hoc-cung-em",
  project: "hoc-cung-em",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  disableLogger: true,
  automaticVercelMonitors: true,
})
