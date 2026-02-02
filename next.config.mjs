/** @type {import('next').NextConfig} */
import CopyPlugin from "copy-webpack-plugin"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "node_modules/@imgly/background-removal/dist/imgly-background-removal-core/wasm/**/*",
            to: "static/chunks/app/[name][ext]",
            context: "node_modules/@imgly/background-removal/dist/imgly-background-removal-core/wasm",
          },
          {
            from: "node_modules/@imgly/background-removal/dist/imgly-background-removal-core/onnx/**/*",
            to: "static/chunks/app/[name][ext]",
            context: "node_modules/@imgly/background-removal/dist/imgly-background-removal-core/onnx",
          },
          {
            from: "node_modules/onnxruntime-web/dist/*.wasm",
            to: "static/chunks/[name][ext]",
          },
        ],
      })
    )
    return config
  },
}

export default nextConfig
