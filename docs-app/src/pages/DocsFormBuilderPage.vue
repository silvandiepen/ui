<template>
  <div :class="bemm()">
    <section :class="bemm('hero')">
      <h1 :class="bemm('title')">Form Builder</h1>
      <p :class="bemm('summary')">
        Drag and drop fields to compose a form, configure each field's settings and validation,
        then export the resulting <code>FormConfig</code> JSON to use with the
        <code>FormConfig</code> component.
      </p>
    </section>

    <FormBuilder v-model="formConfig" :show-export="true" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import FormBuilder from '@ui-docs/components/FormBuilder/FormBuilder.vue'
import type { FormConfig } from '@ui-lib/components/Form/Form/FormConfig.model'

const bemm = useBemm('docs-form-builder-page', { includeBaseClass: true })

const formConfig = ref<FormConfig>({ fields: [], columns: 1 })
</script>

<style lang="scss">
.docs-form-builder-page {
  display: grid;
  gap: var(--space);
  padding: var(--spacing);

  &__hero {
    display: grid;
    gap: var(--space-s);
  }

  &__title {
    margin: 0;
    font-size: clamp(2rem, 4.2vw, 3.25rem);
    line-height: 0.96;
  }

  &__summary {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 28%);
    line-height: 1.6;
  }
}
</style>
