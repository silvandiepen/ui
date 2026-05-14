// vite.config.ts
import { defineConfig } from "file:///home/hermes/workspace/sil-ui/node_modules/vite/dist/node/index.js";
import vue from "file:///home/hermes/workspace/sil-ui/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///home/hermes/workspace/sil-ui/node_modules/vite-plugin-dts/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "/home/hermes/workspace/sil-ui";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
      exclude: [
        "src/**/*.spec.ts",
        "src/**/*.test.ts",
        "src/**/*.stories.ts"
      ]
    })
  ],
  resolve: {
    alias: [
      { find: "@/components/ui", replacement: resolve(__vite_injected_original_dirname, "./src/components") },
      { find: "@/common", replacement: resolve(__vite_injected_original_dirname, "./src/common") },
      { find: "@/constants", replacement: resolve(__vite_injected_original_dirname, "./src/constants") },
      { find: "@/mixins", replacement: resolve(__vite_injected_original_dirname, "./src/mixins") },
      { find: "@components", replacement: resolve(__vite_injected_original_dirname, "./src/components") },
      { find: "@composables", replacement: resolve(__vite_injected_original_dirname, "./src/composables") },
      { find: "@utils", replacement: resolve(__vite_injected_original_dirname, "./src/utils") },
      { find: "@stores", replacement: resolve(__vite_injected_original_dirname, "./src/stores") },
      { find: "@types", replacement: resolve(__vite_injected_original_dirname, "./src/types") },
      { find: "@", replacement: resolve(__vite_injected_original_dirname, "./src") }
    ]
  },
  build: {
    // Only build type declarations via vite-plugin-dts.
    // Component source (.vue + .ts) is shipped as-is —
    // consuming projects compile it through Vite with theme SCSS vars injected by ui().
    outDir: "dist",
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/vite/index.js"),
      formats: ["es"],
      fileName: () => "vite/index.js"
    },
    rollupOptions: {
      external: ["node:url", "node:fs", "node:crypto", "node:path"]
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  },
  test: {
    globals: true,
    environment: "node",
    exclude: [
      "src/components/**/!(FormConfig)*.{spec,test}.ts",
      "node_modules",
      "dist"
    ]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9oZXJtZXMvd29ya3NwYWNlL3NpbC11aVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvaGVybWVzL3dvcmtzcGFjZS9zaWwtdWkvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvaGVybWVzL3dvcmtzcGFjZS9zaWwtdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgZHRzKHtcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnRzJywgJ3NyYy8qKi8qLnZ1ZSddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjLyoqLyouc3BlYy50cycsXG4gICAgICAgICdzcmMvKiovKi50ZXN0LnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qLnN0b3JpZXMudHMnXG4gICAgICBdXG4gICAgfSlcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiBbXG4gICAgICB7IGZpbmQ6ICdAL2NvbXBvbmVudHMvdWknLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb25lbnRzJykgfSxcbiAgICAgIHsgZmluZDogJ0AvY29tbW9uJywgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tbW9uJykgfSxcbiAgICAgIHsgZmluZDogJ0AvY29uc3RhbnRzJywgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29uc3RhbnRzJykgfSxcbiAgICAgIHsgZmluZDogJ0AvbWl4aW5zJywgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvbWl4aW5zJykgfSxcbiAgICAgIHsgZmluZDogJ0Bjb21wb25lbnRzJywgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpIH0sXG4gICAgICB7IGZpbmQ6ICdAY29tcG9zYWJsZXMnLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9jb21wb3NhYmxlcycpIH0sXG4gICAgICB7IGZpbmQ6ICdAdXRpbHMnLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy91dGlscycpIH0sXG4gICAgICB7IGZpbmQ6ICdAc3RvcmVzJywgcmVwbGFjZW1lbnQ6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvc3RvcmVzJykgfSxcbiAgICAgIHsgZmluZDogJ0B0eXBlcycsIHJlcGxhY2VtZW50OiByZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJykgfSxcbiAgICAgIHsgZmluZDogJ0AnLCByZXBsYWNlbWVudDogcmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpIH0sXG4gICAgXVxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIE9ubHkgYnVpbGQgdHlwZSBkZWNsYXJhdGlvbnMgdmlhIHZpdGUtcGx1Z2luLWR0cy5cbiAgICAvLyBDb21wb25lbnQgc291cmNlICgudnVlICsgLnRzKSBpcyBzaGlwcGVkIGFzLWlzIFx1MjAxNFxuICAgIC8vIGNvbnN1bWluZyBwcm9qZWN0cyBjb21waWxlIGl0IHRocm91Z2ggVml0ZSB3aXRoIHRoZW1lIFNDU1MgdmFycyBpbmplY3RlZCBieSB1aSgpLlxuICAgIG91dERpcjogJ2Rpc3QnLFxuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy92aXRlL2luZGV4LmpzJyksXG4gICAgICBmb3JtYXRzOiBbJ2VzJ10sXG4gICAgICBmaWxlTmFtZTogKCkgPT4gJ3ZpdGUvaW5kZXguanMnLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsnbm9kZTp1cmwnLCAnbm9kZTpmcycsICdub2RlOmNyeXB0bycsICdub2RlOnBhdGgnXSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcidcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnbm9kZScsXG4gICAgZXhjbHVkZTogW1xuICAgICAgJ3NyYy9jb21wb25lbnRzLyoqLyEoRm9ybUNvbmZpZykqLntzcGVjLHRlc3R9LnRzJyxcbiAgICAgICdub2RlX21vZHVsZXMnLFxuICAgICAgJ2Rpc3QnLFxuICAgIF0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5USxTQUFTLG9CQUFvQjtBQUN0UyxPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsZUFBZTtBQUh4QixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxNQUNsQixTQUFTLENBQUMsZUFBZSxjQUFjO0FBQUEsTUFDdkMsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0sbUJBQW1CLGFBQWEsUUFBUSxrQ0FBVyxrQkFBa0IsRUFBRTtBQUFBLE1BQy9FLEVBQUUsTUFBTSxZQUFZLGFBQWEsUUFBUSxrQ0FBVyxjQUFjLEVBQUU7QUFBQSxNQUNwRSxFQUFFLE1BQU0sZUFBZSxhQUFhLFFBQVEsa0NBQVcsaUJBQWlCLEVBQUU7QUFBQSxNQUMxRSxFQUFFLE1BQU0sWUFBWSxhQUFhLFFBQVEsa0NBQVcsY0FBYyxFQUFFO0FBQUEsTUFDcEUsRUFBRSxNQUFNLGVBQWUsYUFBYSxRQUFRLGtDQUFXLGtCQUFrQixFQUFFO0FBQUEsTUFDM0UsRUFBRSxNQUFNLGdCQUFnQixhQUFhLFFBQVEsa0NBQVcsbUJBQW1CLEVBQUU7QUFBQSxNQUM3RSxFQUFFLE1BQU0sVUFBVSxhQUFhLFFBQVEsa0NBQVcsYUFBYSxFQUFFO0FBQUEsTUFDakUsRUFBRSxNQUFNLFdBQVcsYUFBYSxRQUFRLGtDQUFXLGNBQWMsRUFBRTtBQUFBLE1BQ25FLEVBQUUsTUFBTSxVQUFVLGFBQWEsUUFBUSxrQ0FBVyxhQUFhLEVBQUU7QUFBQSxNQUNqRSxFQUFFLE1BQU0sS0FBSyxhQUFhLFFBQVEsa0NBQVcsT0FBTyxFQUFFO0FBQUEsSUFDeEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixLQUFLO0FBQUEsTUFDSCxPQUFPLFFBQVEsa0NBQVcsbUJBQW1CO0FBQUEsTUFDN0MsU0FBUyxDQUFDLElBQUk7QUFBQSxNQUNkLFVBQVUsTUFBTTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsWUFBWSxXQUFXLGVBQWUsV0FBVztBQUFBLElBQzlEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osS0FBSztBQUFBLE1BQ1A7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsU0FBUztBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
