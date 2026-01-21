import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      fonts: {
        body: {
          value:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        heading: {
          value:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        mono: {
          value:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        },
      },
      radii: {
        lg: { value: "0.75rem" },
      },
      colors: {
        primary: {
          50: { value: "#f5f5f6" },
          100: { value: "#e5e6e7" },
          200: { value: "#cacbcd" },
          300: { value: "#a8aaad" },
          400: { value: "#7e8185" },
          500: { value: "#636669" },
          600: { value: "#545659" },
          700: { value: "#353739" },
          800: { value: "#3e4042" },
          900: { value: "#272829" },
          950: { value: "#1a1b1c" },
        },
      },
    },
    semanticTokens: {
      colors: {
        bg: {
          value: { _light: "#fff", _dark: "rgb(17, 18, 20)" },
        },
        "bg.secondary": {
          value: { _light: "#f3f3f3", _dark: "rgb(35, 35, 41)" },
        },
        "text.primary": {
          value: { _light: "#334159", _dark: "#e9eaed" },
        },
        "text.secondary": {
          value: { _light: "#64748b", _dark: "#94a3b8" },
        },
        border: {
          value: { _light: "#e2e8f0", _dark: "#565d6a" },
        },
        link: {
          value: { _light: "#0071e3", _dark: "#2e89e5" },
        },
        "link.hover": {
          value: { _light: "#0b65ff", _dark: "#429efb" },
        },
        primary: {
          solid: { value: "{colors.primary.700}" },
          contrast: { value: "#fff" },
          fg: { value: "{colors.primary.700}" },
          muted: { value: "{colors.primary.100}" },
          subtle: { value: "{colors.primary.200}" },
          emphasized: { value: "{colors.primary.600}" },
          focusRing: { value: "{colors.primary.500}" },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: "bg",
      color: "text.primary",
      minHeight: "100vh",
    },
    a: {
      color: "link",
      _hover: {
        color: "link.hover",
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
