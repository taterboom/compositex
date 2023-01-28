import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        options: path.resolve(__dirname, "options.html"),
        popup: path.resolve(__dirname, "popup.html"),
      },
    },
  },
})
