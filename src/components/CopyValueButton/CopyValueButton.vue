<template>
  <button
    :class="[bemm(), copied && bemm('', 'copied')]"
    type="button"
    :title="copied ? 'Copied' : resolvedLabel"
    :aria-label="copied ? 'Copied' : resolvedLabel"
    :data-test-id="testId"
    @click="copyValue"
  >
    <Icon
      :name="copied ? 'check' : 'clipboard'"
      size="small"
      :data-test-id="getTestId(props.testId, 'icon')"
    />
  </button>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { computed, onBeforeUnmount, ref } from "vue";

import Icon from "../Icon/Icon.vue";
import { toast } from "../Toast";

import type { CopyValueButtonProps } from "./CopyValueButton.model";
import { getTestId } from "../../utils/testId";

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
  --copy-value-button-color: color-mix(in srgb, var(--color-foreground), transparent 34%);
  --copy-value-button-border: color-mix(in srgb, var(--color-foreground), transparent 88%);
  --copy-value-button-background: transparent;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  width: 2rem;
  padding: 0;
  border-radius: 999rem;
  border: 1px solid var(--copy-value-button-border);
  background: var(--copy-value-button-background);
  color: var(--copy-value-button-color);
  cursor: pointer;
  transition:
    color 140ms ease,
    border-color 140ms ease,
    background 140ms ease,
    transform 140ms ease;

  &:hover {
    color: var(--color-foreground);
    border-color: color-mix(in srgb, var(--color-foreground), transparent 76%);
    background: color-mix(in srgb, var(--color-foreground), transparent 96%);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus, var(--color-primary));
    outline-offset: 2px;
  }

  &--copied {
    --copy-value-button-color: var(--color-success);
    --copy-value-button-border: color-mix(in srgb, var(--color-success), transparent 68%);
    --copy-value-button-background: color-mix(in srgb, var(--color-success), transparent 92%);
  }
}
</style>
