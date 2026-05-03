<template>
  <span
    :class="bemm()"
    :data-test-id="testId"
  >
    <span
      :class="bemm('surface')"
      :title="resolvedTooltip"
      :data-test-id="getTestId(props.testId, 'surface')"
    >
      <span
        :class="bemm('label')"
        :data-test-id="getTestId(props.testId, 'label')"
      >{{ label }}</span>

      <span
        v-if="copyValue || href"
        :class="bemm('actions')"
        :data-test-id="getTestId(props.testId, 'actions')"
      >
        <button
          v-if="copyValue"
          :class="bemm('action', 'copy')"
          :aria-label="copied ? copiedLabel : resolvedCopyLabel"
          :title="copied ? copiedLabel : resolvedCopyLabel"
          type="button"
          :data-test-id="getTestId(props.testId, 'copy')"
          @click="copy"
        >
          <Icon
            :name="copied ? Icons.UI_CIRCLED_CHECK : Icons.MEDIA_CLIPBOARD"
            :data-test-id="getTestId(props.testId, 'copy-icon')"
          />
        </button>

        <a
          v-if="href"
          :class="bemm('action', 'open')"
          :href="href"
          :aria-label="openLabel"
          :title="openLabel"
          rel="noreferrer"
          target="_blank"
          :data-test-id="getTestId(props.testId, 'open')"
        >
          <Icon
            :name="Icons.ARROWS_ARROW_UP_RIGHT"
            :data-test-id="getTestId(props.testId, 'open-icon')"
          />
        </a>
      </span>
    </span>

    <Tooltip
      v-if="resolvedTooltip"
      :class="bemm('tooltip')"
      :text="resolvedTooltip"
      :show-on-parent-hover="true"
      :open="false"
      :test-id="getTestId(props.testId, 'tooltip')"
    />
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
import { getTestId } from "../../utils/testId";

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
@use '../../styles/mixins' as m;

.reference-badge {
  position: relative;
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
    border-radius: m.p('border-radius', 999px);
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
    transition: m.p('action-transition', opacity 140ms ease);
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: m.p('action-size', calc(var(--space) * 1.85));
    height: m.p('action-size', calc(var(--space) * 1.85));
    padding: 0;
    border-radius: m.p('border-radius', 999px);
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
