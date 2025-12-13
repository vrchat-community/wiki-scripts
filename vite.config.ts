import { defineConfig } from "vite";

export default defineConfig({
  build: {
    assetsDir: "",
    // minify: false,
    rolldownOptions: {
      input: {
        "MediaWiki:Common": "./src/common.ts",
        "MediaWiki:Timeless": "./src/timeless.ts"
      },
      transform: {
        target: "es6"
      },
      output: {
        sanitizeFileName: false,
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]"
      }
    }
  },
  experimental: {
    // We bundle fonts, but haven't uploaded them yet.
    renderBuiltUrl: (filename, type) => {
      if (filename.startsWith("exo-2"))
        return `https://cdn.jsdelivr.net/npm/@fontsource-variable/exo-2/files/${filename}`;

      if (filename.startsWith("noto-sans"))
        return `https://cdn.jsdelivr.net/npm/@fontsource-variable/noto-sans/files/${filename}`;
    }
  }
})