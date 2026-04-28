<template>
  <kbd
    :class="blockClasses"
    :data-test-id="testId"
  >
    <slot />
    <Icon
      v-if="props.icon"
      :name="props.icon"
      :class="bemm('icon')"
      :data-test-id="getTestId(props.testId, 'icon')"
    />
  </kbd>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useBemm } from "bemm";

import Icon from "../Icon/Icon.vue";
import type { KbdProps } from "./Kbd.model";
import { getTestId } from "../../utils/testId";

defineOptions({
  name: "Kbd",
});

const props = withDefaults(defineProps<KbdProps>(), {
  size: "medium",
  variant: "default",
  icon: null,
});

const bemm = useBemm("kbd");

const blockClasses = computed(() => [
  bemm(),
  bemm("", props.size),
  props.variant !== "default" ? bemm("", props.variant) : "",
]);
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: m.p("min-size", calc(var(--space) * 1.75));
  min-height: m.p("min-size", calc(var(--space) * 1.75));
  padding: m.p("padding", var(--space-xs) calc(var(--space-xs) * 1.75));
  border: 1px solid
    m.p("border-color", color-mix(in srgb, var(--color-foreground), transparent 84%));
  border-bottom-width: 2px;
  border-radius: m.p("border-radius", var(--border-radius-l));
  background: m.p(
    "background",
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--color-background), white 28%) 0%,
      color-mix(in srgb, var(--color-background), var(--color-foreground) 4%) 100%
    )
  );
  box-shadow: m.p("box-shadow", inset 0 1px 0 color-mix(in srgb, white, transparent 30%));
  color: m.p("color", color-mix(in srgb, var(--color-foreground), transparent 12%));
  font-family: m.p(
    "font-family",
    var(--font-family-mono, ui-monospace, SFMono-Regular, Menlo, monospace)
  );
  font-size: m.p("font-size", var(--font-size-s));
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  aspect-ratio: m.p("aspect-ratio", 1);

  &--small {
    --int-kbd-min-size: var(--space);
    --int-kdb-padding: var(--space-xs);
    --int-kbd-font-size: var(--font-size-xs);
  }

  &--subtle {
    --int-kbd-background: color-mix(
      in srgb,
      var(--color-background),
      var(--color-foreground) 5%
    );
    --int-kbd-color: color-mix(in srgb, var(--color-foreground), transparent 50%);
    --int-kbd-box-shadow: none;
  }
}
</style>
