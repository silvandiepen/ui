# ColorChooser

Advanced color selection component with a color wheel, HSL sliders, typed value inputs, and complimentary color suggestions.

## Usage

```vue
<ColorChooser
  v-model="color"
  label="Theme color"
  output-format="hex"
  :complimentary="{ total: 6, type: 'hue' }"
  :palette-colors="['#ef476f', '#ffd166', '#06d6a0']"
/>
```

## Props

- `v-model` (`string`): Current color value.
- `outputFormat` (`'hex' | 'rgb' | 'hsl'`): Emitted format.
- `wheel` (`boolean`): Show the color wheel.
- `showHexInput` (`boolean`): Show hex input.
- `showRgbInputs` (`boolean`): Show RGB inputs.
- `showHslInputs` (`boolean`): Show HSL numeric inputs.
- `showHslSliders` (`boolean`): Show HSL range sliders.
- `showInputModeTabs` (`boolean`): Show tabs to switch active input mode.
- `inputMode` (`'hex' | 'rgb' | 'hsl'`): Initial active input mode.
- `complimentary` (`boolean | number | { total?: number; type?: 'shade' | 'tint' | 'tone' | 'hue' }`): Complimentary suggestions config.
- `recentColors` (`string[]`): Optional recent swatches.
- `paletteColors` (`string[]`): Optional palette swatches (`palletteColors` alias also supported).
- `wheelSize` (`number`): Wheel size in pixels.
