import path from "path"
import { fileURLToPath } from "url"

const __dirname = fileURLToPath(new URL(".", import.meta.url))
const isDev = process.env.NODE_ENV === "development"

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isDev && {
    turbopack: {
      root: path.resolve(__dirname, "../.."),
    },
  }),
}

export default nextConfig
