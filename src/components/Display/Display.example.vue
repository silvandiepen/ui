<template>
  <div :class="bemm()">
      <Row :class="bemm('row')">
        <DisplayBadge value="12" />
        <DisplayBadge value="synced" color="success" />
      </Row>

      <Note type="info">
        Display helpers stay available for compact metadata and supporting content layouts.
      </Note>

      <Spacer direction="row" align="center">
        <span :class="bemm('pill')">Row</span>
        <span :class="bemm('pill')">Chip</span>
        <span :class="bemm('pill')">Note</span>
      </Spacer>
    </div>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'

import { Badge as DisplayBadge, Note, Row, Spacer } from './index'

const bemm = useBemm('display-example')
</script>

<style lang="scss">
.display-example {
  display: grid;
  gap: var(--space);

  &__row {
    gap: var(--space-xs);
  }

  &__pill {
    padding: var(--space-xs) var(--space-s);
    border-radius: 999px;
    background: color-mix(in srgb, var(--color-primary), transparent 88%);
    color: var(--color-primary);
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-medium);
  }
}
</style>
