<template>
  <Example
    :component="ColorChooser"
    name="ColorChooser"
    :prop-options="{
      outputFormat: ['hex', 'rgb', 'hsl'],
      inputMode: ['hex', 'rgb', 'hsl'],
      wheel: [true, false],
      showHexInput: [true, false],
      showRgbInputs: [true, false],
      showHslInputs: [true, false],
      showHslSliders: [true, false],
      showInputModeTabs: [true, false],
      complimentary: [
        false,
        true,
        6,
        { total: 6, type: 'hue' },
        { total: 6, type: 'shade' },
        { total: 6, type: 'tint' },
        { total: 6, type: 'tone' },
      ],
      recentColors: [
        [],
        ['#ff6b6b', '#4ecdc4', '#ffe66d', '#1a535c'],
      ],
      paletteColors: [
        [],
        ['#ef476f', '#ffd166', '#06d6a0', '#118ab2', '#073b4c'],
      ],
    }"
  />
</template>

<script setup lang="ts">
import ColorChooser from './ColorChooser.vue'
</script>
