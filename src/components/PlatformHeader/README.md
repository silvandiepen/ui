# PlatformHeader

Shared shell header used across Emila apps, with flexible slots for brand, navigation, actions, and secondary content.

`colorMode` defaults to `auto`, which follows the document color mode through `data-color-mode` or `data-theme`, with `prefers-color-scheme` as a fallback. Pass `light` or `dark` to keep the header fixed in that mode.
