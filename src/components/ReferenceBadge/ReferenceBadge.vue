<template>
  <span :class="bemm()">
    <span :class="bemm('surface')" :title="resolvedTooltip">
      <span :class="bemm('label')">{{ label }}</span>
      <Tooltip
        v-if="resolvedTooltip"
        :class="bemm('tooltip')"
        :text="resolvedTooltip"
        :show-on-parent-hover="true"
        :open="false"
      />

      <span v-if="copyValue || href" :class="bemm('actions')">
        <button
          v-if="copyValue"
          :class="bemm('action', 'copy')"
          :aria-label="copied ? copiedLabel : resolvedCopyLabel"
          :title="copied ? copiedLabel : resolvedCopyLabel"
          type="button"
          @click="copy"
        >
          <Icon :name="copied ? Icons.CIRCLED_CHECK : Icons.CLIPBOARD" />
        </button>

        <a
          v-if="href"
          :class="bemm('action', 'open')"
          :href="href"
          :aria-label="openLabel"
          :title="openLabel"
          rel="noreferrer"
          target="_blank"
        >
          <Icon :name="Icons.ARROW_UP_RIGHT" />
        </a>
      </span>
    </span>
  </span>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { Icons } from "open-icon";
import { computed, onBeforeUnmount, ref } from "vue";

import { Icon } from "../Icon";
import { toast } from "../Toast";
import { Tooltip } from "../Tooltip";

import type { ReferenceBadgeProps } from "./ReferenceBadge.model";

defineOptions({
  name: "ReferenceBadge"
});

const props = defineProps<ReferenceBadgeProps>();

const bemm = useBemm("reference-badge", {
  includeBaseClass: true
});

const copied = ref(false);
const resolvedTooltip = computed(() => props.tooltipText?.trim() || props.label);
const resolvedCopyLabel = computed(() => props.copyLabel?.trim() || "Copy reference");
const copiedLabel = "Copied";
const openLabel = "Open reference";
let copiedTimeout: number | null = null;

async function copy() {
  if (!props.copyValue) {
    return;
  }

  await navigator.clipboard.writeText(props.copyValue);
  copied.value = true;

  toast({
    type: "success",
    title: copiedLabel,
    message: props.copyValue
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
.reference-badge {
  display: inline-flex;
  align-items: center;
  min-width: 0;
  max-width: 100%;

  &__surface {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-width: 0;
    max-width: 100%;
    padding: calc(var(--space) * 0.28) calc(var(--space) * 0.55);
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);
    color: color-mix(in srgb, var(--color-foreground), transparent 16%);
    overflow: hidden;
  }

  &__label {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: calc(var(--font-size) * 0.92);
    font-weight: var(--font-weight-bold);
  }

  &__actions {
    position: absolute;
    inset: 0;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: calc(var(--space) * 0.25);
    padding: calc(var(--space) * 0.16) calc(var(--space) * 0.18) calc(var(--space) * 0.16) calc(var(--space) * 1.8);
    background: linear-gradient(90deg, transparent 0%, color-mix(in srgb, var(--color-background), var(--color-foreground) 3%) 34%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 140ms ease;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.85rem;
    height: 1.85rem;
    padding: 0;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 1%);
    color: color-mix(in srgb, var(--color-foreground), transparent 34%);
    text-decoration: none;
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

  &:hover &__actions,
  &:focus-within &__actions {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
