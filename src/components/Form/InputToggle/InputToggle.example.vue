<template>
  <div :class="bemm()">
      <InputToggle
        v-model="enabled"
        label="Enable notifications"
      />

      <InputToggle
        v-model="darkMode"
        label="Theme"
        color="secondary"
        :items="themeItems"
      />

      <InputToggle
        v-model="locked"
        label="Visibility"
        color="warning"
        :items="visibilityItems"
      />

      <InputToggle
        v-model="bookmark"
        label="Bookmark"
        color="success"
        :items="bookmarkItems"
      />

      <p :class="bemm('value')">
        Notifications: {{ enabled ? 'on' : 'off' }} |
        Theme: {{ darkMode }} |
        Visibility: {{ locked }} |
        Bookmark: {{ bookmark }}
      </p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useBemm } from 'bemm'
import { Icons } from 'open-icon'
import type { ToggleItem } from './InputToggle.model'
import InputToggle from './InputToggle.vue'

type ToggleItemPair = [ToggleItem, ToggleItem]

const bemm = useBemm('t-input-toggle-example')

const enabled = ref(true)
const darkMode = ref<'light' | 'dark'>('light')
const locked = ref<'public' | 'private'>('public')
const bookmark = ref<'saved' | 'unsaved'>('unsaved')

const themeItems: ToggleItemPair = [
  { label: 'Light', value: 'light', icon: Icons.SUN },
  { label: 'Dark', value: 'dark', icon: Icons.MOON_DARK_MODE },
]

const visibilityItems: ToggleItemPair = [
  { label: 'Public', value: 'public', icon: Icons.VISIBLE_M },
  { label: 'Private', value: 'private', icon: Icons.INVISIBLE_M },
]

const bookmarkItems: ToggleItemPair = [
  { label: 'Saved', value: 'saved', icon: Icons.STAR_FAT },
  { label: 'Unsaved', value: 'unsaved', icon: Icons.STAR_M },
]
</script>

<style lang="scss">
.t-input-toggle-example {
  display: grid;
  gap: var(--space);

  &__value {
    margin: 0;
  }
}
</style>
