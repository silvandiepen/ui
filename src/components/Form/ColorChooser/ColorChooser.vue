<template>
  <div :class="bemm('', [disabled ? 'disabled' : ''])">
    <div v-if="label" :class="bemm('label')">{{ label }}</div>
    <div v-if="description" :class="bemm('description')">{{ description }}</div>
    <div :class="bemm('preview')" :style="{ backgroundColor: previewColor }" />

    <div :class="bemm('surface')">
      <div :class="bemm('picker-row')">
        <div
          v-if="wheel"
          ref="wheelShellElement"
          :class="bemm('wheel-shell')"
          :style="wheelStyle"
          data-testid="color-chooser-wheel"
        >
          <div :class="bemm('wheel-ring')" @pointerdown="handleHuePointerDown" />
          <div :class="bemm('wheel-hue-marker')" :style="hueMarkerStyle" />

          <div
            ref="planeElement"
            :class="bemm('plane')"
            :style="planeStyle"
            data-testid="color-chooser-plane"
            @pointerdown.stop="handlePlanePointerDown"
          >
            <div :class="bemm('plane-white')" />
            <div :class="bemm('plane-black')" />
            <div :class="bemm('plane-marker')" :style="planeMarkerStyle" />
          </div>
        </div>

        <div :class="bemm('sliders')">
          <ColorChooserSlider
            :model-value="opacity"
            label="%"
            :min="0"
            :max="100"
            :disabled="disabled"
            :gradient="opacityGradient"
            @update:model-value="setOpacity"
          />

          <ColorChooserSlider
            :model-value="internalHsl.s"
            label="S"
            :min="0"
            :max="100"
            :disabled="disabled"
            :gradient="saturationGradient"
            @update:model-value="(value) => setHslChannel('s', value)"
          />

          <ColorChooserSlider
            :model-value="internalHsl.l"
            label="L"
            :min="0"
            :max="100"
            :disabled="disabled"
            :gradient="lightnessGradient"
            @update:model-value="(value) => setHslChannel('l', value)"
          />
        </div>
      </div>

      <div :class="bemm('fields')">
        <div
          v-if="showInputModeTabs && availableInputModes.length > 0"
          :class="bemm('mode-tabs')"
        >
          <TabNavigation
            :items="modeTabItems"
            :value="activeInputMode"
            :minimal="true"
            :size="Size.SMALL"
            @input="handleModeTabInput"
          />
        </div>

        <FormField
          v-if="showHexInput && activeInputMode === 'hex'"
          name="hex"
          label="Hex"
          direction="row"
          label-width="2.25rem"
          :show-error="false"
          :class="bemm('field-inline')"
        >
          <InputText
            :model-value="hexValue"
            :label="''"
            :controls="false"
            :disabled="disabled"
            :size="Size.SMALL"
            @update:model-value="setFromTextInput"
          />
        </FormField>

        <FormGroup
          v-if="showRgbInputs && activeInputMode === 'rgb'"
          direction="row"
          :wrap="false"
          :class="bemm('field-group')"
        >
          <FormField
            name="rgb-r"
            label="R"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="rgbValue.r"
              :label="''"
              :min="0"
              :max="255"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onRgbRUpdate"
            />
          </FormField>
          <FormField
            name="rgb-g"
            label="G"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="rgbValue.g"
              :label="''"
              :min="0"
              :max="255"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onRgbGUpdate"
            />
          </FormField>
          <FormField
            name="rgb-b"
            label="B"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="rgbValue.b"
              :label="''"
              :min="0"
              :max="255"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onRgbBUpdate"
            />
          </FormField>
        </FormGroup>

        <FormGroup
          v-if="showHslInputs && activeInputMode === 'hsl'"
          direction="row"
          :wrap="false"
          :class="bemm('field-group')"
        >
          <FormField
            name="hsl-h"
            label="H"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="internalHsl.h"
              :label="''"
              :min="0"
              :max="360"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onHslHUpdate"
            />
          </FormField>
          <FormField
            name="hsl-s"
            label="S"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="internalHsl.s"
              :label="''"
              :min="0"
              :max="100"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onHslSUpdate"
            />
          </FormField>
          <FormField
            name="hsl-l"
            label="L"
            direction="row"
            label-width="1.2rem"
            :show-error="false"
            :class="bemm('field-inline')"
          >
            <InputNumber
              :model-value="internalHsl.l"
              :label="''"
              :min="0"
              :max="100"
              :disabled="disabled"
            :size="Size.SMALL"
              @update:model-value="onHslLUpdate"
            />
          </FormField>
        </FormGroup>
      </div>

      <div v-if="complimentaryColors.length" :class="bemm('complimentary')">
        <span :class="bemm('complimentary-label')">Complimentary</span>
        <div :class="bemm('complimentary-list')">
          <button
            v-for="color in complimentaryColors"
            :key="color"
            :class="bemm('complimentary-item')"
            :style="{ backgroundColor: color }"
            :title="color"
            type="button"
            :disabled="disabled"
            @click="setFromTextInput(color)"
          />
        </div>
      </div>

      <div v-if="normalizedRecentColors.length" :class="bemm('swatch-group')">
        <span :class="bemm('complimentary-label')">Recent</span>
        <div :class="bemm('complimentary-list')">
          <button
            v-for="color in normalizedRecentColors"
            :key="`recent-${color}`"
            :class="bemm('complimentary-item')"
            :style="{ backgroundColor: color }"
            :title="color"
            type="button"
            :disabled="disabled"
            @click="setFromTextInput(color)"
          />
        </div>
      </div>

      <div v-if="normalizedPaletteColors.length" :class="bemm('swatch-group')">
        <span :class="bemm('complimentary-label')">Palette</span>
        <div :class="bemm('complimentary-list')">
          <button
            v-for="color in normalizedPaletteColors"
            :key="`palette-${color}`"
            :class="bemm('complimentary-item')"
            :style="{ backgroundColor: color }"
            :title="color"
            type="button"
            :disabled="disabled"
            @click="setFromTextInput(color)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toHex, toHSL } from "@sil/color";
import { useBemm } from "bemm";
import { computed, onUnmounted, ref, watch } from "vue";

import { FormField, FormGroup } from "../Form";
import { InputNumber } from "../InputNumber";
import { InputText } from "../InputText";
import { TabNavigation } from "../../Tabs";
import type {
  ColorChooserComplimentaryType,
  ColorChooserEmits,
  ColorChooserHsl,
  ColorChooserInputMode,
  ColorChooserProps,
  ColorChooserRgb,
} from "./ColorChooser.model";
import type { TabNavigationItem } from "../../Tabs/Tabs.model";
import ColorChooserSlider from "./ColorChooserSlider.vue";
import {
  clamp,
  formatColor,
  hslToRgb,
  parseColorString,
  rgbToHsl,
  sanitizeHsl,
} from "./ColorChooser.utils";
import { Size } from "../../../types";

const props = withDefaults(defineProps<ColorChooserProps>(), {
  modelValue: "#4b0082",
  label: "",
  description: "",
  disabled: false,
  wheel: true,
  wheelSize: 220,
  showHexInput: true,
  showRgbInputs: true,
  showHslInputs: true,
  inputMode: "hex",
  showInputModeTabs: true,
  showHslSliders: true,
  complimentary: false,
  recentColors: () => [],
  palletteColors: () => [],
  paletteColors: () => [],
  outputFormat: "hex",
});

const emit = defineEmits<ColorChooserEmits>();

const bemm = useBemm("color-chooser", { includeBaseClass: true });
const wheelShellElement = ref<HTMLDivElement | null>(null);
const planeElement = ref<HTMLDivElement | null>(null);
const isDraggingHue = ref(false);
const isDraggingPlane = ref(false);
const internalHsl = ref<ColorChooserHsl>({ h: 0, s: 100, l: 50 });
const opacity = ref(100);
const activeInputMode = ref<ColorChooserInputMode>("hex");

const rgbValue = computed(() => hslToRgb(internalHsl.value));
const hexValue = computed(() => formatColor(internalHsl.value, "hex"));
const previewColor = computed(
  () =>
    `hsla(${internalHsl.value.h}, ${internalHsl.value.s}%, ${internalHsl.value.l}%, ${
      opacity.value / 100
    })`
);

const wheelRingThickness = computed(() =>
  Math.max(16, Math.round(props.wheelSize * 0.14))
);
const planeSize = computed(() =>
  Math.max(92, props.wheelSize - (wheelRingThickness.value * 2 + 24))
);

const wheelStyle = computed(() => ({
  width: `${props.wheelSize}px`,
  height: `${props.wheelSize}px`,
  "--color-chooser-ring-thickness": `${wheelRingThickness.value}px`,
}));

const planeStyle = computed(() => ({
  width: `${planeSize.value}px`,
  height: `${planeSize.value}px`,
  "--color-chooser-plane-hue": `hsl(${internalHsl.value.h}, 100%, 50%)`,
}));

const planeMarkerStyle = computed(() => ({
  left: `${internalHsl.value.s}%`,
  top: `${100 - internalHsl.value.l}%`,
}));

const hueMarkerStyle = computed(() => {
  const angle = (internalHsl.value.h * Math.PI) / 180;
  const center = props.wheelSize / 2;
  const radius = center - wheelRingThickness.value / 2;
  const x = center + Math.cos(angle) * radius;
  const y = center + Math.sin(angle) * radius;

  return {
    left: `${x}px`,
    top: `${y}px`,
  };
});

const hueGradient =
  "linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
const opacityGradient = computed(
  () => `linear-gradient(90deg, transparent, ${toHex(hexValue.value)})`
);
const saturationGradient = computed(
  () =>
    `linear-gradient(90deg, hsl(${internalHsl.value.h}, 0%, ${internalHsl.value.l}%), hsl(${internalHsl.value.h}, 100%, ${internalHsl.value.l}%))`
);
const lightnessGradient = computed(
  () =>
    `linear-gradient(90deg, #000000, hsl(${internalHsl.value.h}, ${internalHsl.value.s}%, 50%), #ffffff)`
);

const resolveComplimentaryConfig = () => {
  if (props.complimentary === false || props.complimentary === undefined) {
    return {
      enabled: false as const,
      total: 6,
      type: "hue" as ColorChooserComplimentaryType,
    };
  }

  if (props.complimentary === true) {
    return {
      enabled: true as const,
      total: 6,
      type: "hue" as ColorChooserComplimentaryType,
    };
  }

  if (typeof props.complimentary === "number") {
    return {
      enabled: true as const,
      total: Math.max(2, Math.round(props.complimentary)),
      type: "hue" as ColorChooserComplimentaryType,
    };
  }

  return {
    enabled: true as const,
    total: Math.max(2, Math.round(props.complimentary.total ?? 6)),
    type: props.complimentary.type ?? "hue",
  };
};

const complimentaryColors = computed<string[]>(() => {
  const config = resolveComplimentaryConfig();
  if (!config.enabled) {
    return [];
  }

  const total = config.total;
  const base = toHSL(hexValue.value as any);

  const colors = Array.from({ length: total }, (_, index) => {
    const progress = total <= 1 ? 0 : index / (total - 1);
    const step = 360 / total;
    let h = base.h;
    let s = clamp(Math.max(base.s, 45), 0, 100);
    let l = clamp(Math.max(base.l, 42), 0, 100);

    if (config.type === "hue") {
      h = (base.h + step * index) % 360;
    } else if (config.type === "shade") {
      l = clamp(base.l - progress * 35, 28, 100);
    } else if (config.type === "tint") {
      l = clamp(base.l + progress * 30, 0, 92);
    } else if (config.type === "tone") {
      s = clamp(base.s - progress * 35, 18, 100);
    }

    return toHex({ h, s, l } as any);
  });

  return Array.from(new Set(colors));
});

const normalizeColorList = (colors: string[]) => {
  const normalized: string[] = [];

  for (const color of colors) {
    const parsed = parseColorString(color);
    if (!parsed) {
      continue;
    }

    normalized.push(formatColor(rgbToHsl(parsed), "hex"));
  }

  return Array.from(new Set(normalized));
};

const normalizedRecentColors = computed(() => normalizeColorList(props.recentColors));
const normalizedPaletteColors = computed(() =>
  normalizeColorList(
    props.palletteColors.length ? props.palletteColors : props.paletteColors
  )
);

const availableInputModes = computed<ColorChooserInputMode[]>(() => {
  const modes: ColorChooserInputMode[] = [];

  if (props.showHexInput) modes.push("hex");
  if (props.showRgbInputs) modes.push("rgb");
  if (props.showHslInputs) modes.push("hsl");

  if (props.showInputModeTabs && modes.length <= 1) {
    return ["hex", "rgb", "hsl"];
  }

  return modes;
});

const modeTabItems = computed<TabNavigationItem[]>(() =>
  availableInputModes.value.map((mode) => ({
    id: mode,
    label: mode.toUpperCase(),
  }))
);

const handleModeTabInput = (value: string | number) => {
  if (typeof value !== "string") {
    return;
  }

  const next = value.toLowerCase() as ColorChooserInputMode;
  if (!availableInputModes.value.includes(next)) {
    return;
  }

  activeInputMode.value = next;
};

watch(
  [availableInputModes, () => props.inputMode],
  ([modes, preferredMode]) => {
    if (modes.length === 0) {
      activeInputMode.value = "hex";
      return;
    }

    if (preferredMode && modes.includes(preferredMode)) {
      activeInputMode.value = preferredMode;
      return;
    }

    if (!modes.includes(activeInputMode.value)) {
      activeInputMode.value = modes[0];
    }
  },
  { immediate: true }
);

const applyModelValue = (nextValue: string | undefined) => {
  if (!nextValue) {
    return;
  }

  const parsedRgb = parseColorString(nextValue);
  if (!parsedRgb) {
    return;
  }

  internalHsl.value = sanitizeHsl(rgbToHsl(parsedRgb));
};

watch(
  () => props.modelValue,
  (value) => {
    applyModelValue(value);
  },
  { immediate: true }
);

const emitColor = () => {
  const output = formatColor(internalHsl.value, props.outputFormat);
  emit("update:modelValue", output);
  emit("change", output);
};

const setHsl = (nextHsl: ColorChooserHsl) => {
  internalHsl.value = sanitizeHsl(nextHsl);
  emitColor();
};

const setOpacity = (value: number) => {
  opacity.value = clamp(Math.round(value), 0, 100);
};

const setFromTextInput = (value: string | undefined) => {
  if (props.disabled || value === undefined) {
    return;
  }

  const parsed = parseColorString(value);
  if (!parsed) {
    return;
  }

  setHsl(rgbToHsl(parsed));
};

const setRgbChannel = (channel: keyof ColorChooserRgb, rawValue: number | undefined) => {
  if (props.disabled || typeof rawValue !== "number" || Number.isNaN(rawValue)) {
    return;
  }

  const nextRgb = {
    ...rgbValue.value,
    [channel]: clamp(rawValue, 0, 255),
  };

  setHsl(rgbToHsl(nextRgb));
};

const setHslChannel = (channel: keyof ColorChooserHsl, value: number | undefined) => {
  if (props.disabled || typeof value !== "number" || Number.isNaN(value)) {
    return;
  }

  setHsl({
    ...internalHsl.value,
    [channel]: value,
  });
};

const coerceNumericUpdate = (value: unknown): number | undefined => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return undefined;
  }

  return value;
};

const onRgbRUpdate = (value: unknown) => setRgbChannel("r", coerceNumericUpdate(value));
const onRgbGUpdate = (value: unknown) => setRgbChannel("g", coerceNumericUpdate(value));
const onRgbBUpdate = (value: unknown) => setRgbChannel("b", coerceNumericUpdate(value));
const onHslHUpdate = (value: unknown) => setHslChannel("h", coerceNumericUpdate(value));
const onHslSUpdate = (value: unknown) => setHslChannel("s", coerceNumericUpdate(value));
const onHslLUpdate = (value: unknown) => setHslChannel("l", coerceNumericUpdate(value));

const updateFromPlanePointer = (event: PointerEvent) => {
  if (!planeElement.value || props.disabled) {
    return;
  }

  const rect = planeElement.value.getBoundingClientRect();
  const x = clamp(event.clientX - rect.left, 0, rect.width);
  const y = clamp(event.clientY - rect.top, 0, rect.height);

  setHsl({
    ...internalHsl.value,
    s: Math.round((x / rect.width) * 100),
    l: Math.round(100 - (y / rect.height) * 100),
  });
};

const updateHueFromPointer = (event: PointerEvent) => {
  const wheelElement = wheelShellElement.value;
  if (!wheelElement || props.disabled) {
    return;
  }

  const rect = wheelElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  setHsl({
    ...internalHsl.value,
    h: angle < 0 ? angle + 360 : angle,
  });
};

const handleHuePointerDown = (event: PointerEvent) => {
  if (props.disabled) {
    return;
  }

  isDraggingHue.value = true;
  updateHueFromPointer(event);

  window.addEventListener("pointermove", handleGlobalPointerMove);
  window.addEventListener("pointerup", stopDragging);
};

const handlePlanePointerMove = (event: PointerEvent) => {
  if (!isDraggingPlane.value) {
    return;
  }

  updateFromPlanePointer(event);
};

const handleHuePointerMove = (event: PointerEvent) => {
  if (!isDraggingHue.value) {
    return;
  }

  updateHueFromPointer(event);
};

const handleGlobalPointerMove = (event: PointerEvent) => {
  handlePlanePointerMove(event);
  handleHuePointerMove(event);
};

const stopDragging = () => {
  isDraggingHue.value = false;
  isDraggingPlane.value = false;
  window.removeEventListener("pointermove", handleGlobalPointerMove);
  window.removeEventListener("pointerup", stopDragging);
};

const handlePlanePointerDown = (event: PointerEvent) => {
  if (props.disabled) {
    return;
  }

  isDraggingPlane.value = true;
  updateFromPlanePointer(event);

  window.addEventListener("pointermove", handleGlobalPointerMove);
  window.addEventListener("pointerup", stopDragging);
};

onUnmounted(() => {
  stopDragging();
});
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.color-chooser {
  display: grid;
  gap: var(--space-xs);

  &__label {
    font-weight: 600;
    font-size: var(--font-size-s);
  }

  &__description {
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: var(--font-size-xs);
  }

  &__surface {
    display: grid;
    gap: var(--space-s);
    border: 1px solid m.p('surface-border', color-mix(in srgb, var(--color-foreground), transparent 85%));
    border-radius: m.p('surface-radius', var(--border-radius));
    background: m.p('surface-background', var(--color-background));
    padding: var(--space-s);
  }

  &__picker-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-s);

    @media (min-width: 860px) {
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
    }
  }

  &__wheel-shell {
    position: relative;
    display: grid;
    place-items: center;
    width: fit-content;
    height: fit-content;
  }

  &__wheel-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    cursor: crosshair;
    touch-action: none;
    background-image: conic-gradient(
      #ff0000,
      #ffff00,
      #00ff00,
      #00ffff,
      #0000ff,
      #ff00ff,
      #ff0000
    );
    background-size: 120% 120%;
    background-repeat: no-repeat;
    background-position: center;

    &::after {
      content: "";
      position: absolute;
      inset: var(--color-chooser-ring-thickness, 18px);
      border-radius: 50%;
      background: m.p('surface-background', var(--color-background));
      pointer-events: none;
    }
  }

  &__wheel-hue-marker {
    position: absolute;
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-foreground), transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 3;
  }

  &__plane {
    position: relative;
    z-index: 2;
    border-radius: 50%;
    cursor: crosshair;
    touch-action: none;
    background: var(--color-chooser-plane-hue);
    overflow: hidden;
  }

  &__plane-white,
  &__plane-black {
    position: absolute;
    inset: 0;
  }

  &__plane-white {
    background: linear-gradient(90deg, #ffffff, transparent);
  }

  &__plane-black {
    background: linear-gradient(180deg, transparent, #000000);
  }

  &__plane-marker {
    position: absolute;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-foreground), transparent 70%);
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  &__preview-col,
  &__sliders,
  &__fields {
    display: grid;
    gap: var(--space-s);
  }

  &__preview {
    width: 100%;
    height: 2rem;
    border-radius: var(--border-radius-s);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
  }

  &__field-inline {
    min-width: 0;
  }

  &__field-group {
    width: 100%;
    gap: var(--space-xs);

    :deep(.form-group__content) {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-xs);
      align-items: center;
    }

    :deep(.form-field) {
      min-width: 0;
    }
  }

  &__mode-tabs {
    display: inline-flex;
    width: fit-content;
  }

  .input-number,
  .input-text {
    width: 100%;
  }

  &__complimentary {
    display: grid;
    gap: var(--space-xs);
  }

  &__swatch-group {
    display: grid;
    gap: var(--space-xs);
  }

  &__complimentary-label {
    font-size: var(--font-size-xs);
    color: color-mix(in srgb, var(--color-foreground), transparent 38%);
  }

  &__complimentary-list {
    display: flex;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  &__complimentary-item {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 0.35rem;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 76%);
    cursor: pointer;
  }

  &--disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
