<template>
  <button
    :class="bemm()"
    type="button"
    :title="copied ? 'Copied' : resolvedLabel"
    @click="copyValue"
  >
    {{ copied ? "Copied" : resolvedLabel }}
  </button>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { computed, onBeforeUnmount, ref } from "vue";

import { toast } from "../Toast";

import type { CopyValueButtonProps } from "./CopyValueButton.model";

defineOptions({
  name: "CopyValueButton"
});

const props = defineProps<CopyValueButtonProps>();

const bemm = useBemm("copy-value-button", {
  includeBaseClass: true
});
const copied = ref(false);
const resolvedLabel = computed(() => props.label?.trim() || "Copy");
const resolvedSuccessTitle = computed(() => props.successTitle?.trim() || "Copied successfully");
let copiedTimeout: number | null = null;

async function copyValue() {
  await navigator.clipboard.writeText(props.value);
  copied.value = true;
  toast({
    type: "success",
    title: resolvedSuccessTitle.value,
    message: props.value
  });

  if (copiedTimeout) {
    window.clearTimeout(copiedTimeout);
  }

  copiedTimeout = window.setTimeout(() => {
    copied.value = false;
  }, 1500);
}

onBeforeUnmount(() => {
  if (copiedTimeout) {
    window.clearTimeout(copiedTimeout);
  }
});
</script>

<style lang="scss">
.copy-value-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  min-width: 2rem;
  padding: 0 calc(var(--space) * 0.45);
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
  background: transparent;
  color: color-mix(in srgb, var(--color-foreground), transparent 34%);
  font-size: calc(var(--font-size) * 0.78);
  font-weight: var(--font-weight-extra-bold);
  cursor: pointer;
  transition:
    color 140ms ease,
    border-color 140ms ease,
    background 140ms ease;

  &:hover {
    color: var(--color-foreground);
    border-color: color-mix(in srgb, var(--color-foreground), transparent 76%);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
  }
}
</style>
