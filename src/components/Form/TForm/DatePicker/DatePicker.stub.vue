<template>
  <div class="date-picker-stub">
    <input 
      type="date" 
      :value="modelValue" 
      @input="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style lang="scss">
.date-picker-stub {
  input[type="date"] {
    width: 100%;
    padding: var(--space-s);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-s);
  }
}
</style>