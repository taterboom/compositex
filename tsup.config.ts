import path from "path"
import { defineConfig } from "tsup"

export default defineConfig({
  entryPoints: {
    background: path.resolve(__dirname, "src/extension-src/background.ts"),
    "content-script": path.resolve(__dirname, "src/extension-src/content-script.ts"),
    "inject-global": path.resolve(__dirname, "src/extension-src/inject-global.ts"),
  },
  format: "iife",
})
