<template>
  <div style="padding: 2rem; display: flex; flex-direction: column; gap: 2rem;">
    <!-- Basic Card with Title -->
    <Card title="Basic Card with Title">
      <p>This is a simple card with just a title in the header.</p>
    </Card>

    <!-- Card with Header Actions -->
    <Card 
      title="Card with Header Actions"
      :header-actions="[
        { icon: 'edit', label: 'Edit', action: () => console.log('Edit clicked') },
        { icon: 'trash', label: 'Delete', action: () => console.log('Delete clicked') }
      ]"
    >
      <p>This card has icon-only actions in the header.</p>
    </Card>

    <!-- Card with Footer Actions -->
    <Card 
      title="Card with Footer Actions"
      :footer-actions="[
        { label: 'Cancel', variant: 'outline', action: () => console.log('Cancel') },
        { label: 'Save', action: () => console.log('Save') }
      ]"
    >
      <p>This card has full button actions in the footer.</p>
    </Card>

    <!-- Card with Custom Header and Footer Slots -->
    <Card>
      <template #header>
        <h2 style="margin: 0; color: var(--color-primary);">Custom Header Content</h2>
      </template>
      
      <p>This card uses custom header and footer slots for more control.</p>
      
      <template #footer>
        <div style="width: 100%; text-align: center; color: var(--color-gray);">
          Custom footer content
        </div>
      </template>
    </Card>

    <!-- Card with All Features -->
    <Card 
      title="Complete Card Example"
      color="primary"
      variant="elevated"
      :header-actions="[
        { icon: 'settings', label: 'Settings', action: () => console.log('Settings') },
        { icon: 'share', label: 'Share', action: () => console.log('Share') }
      ]"
      :footer-actions="[
        { label: 'Learn More', variant: 'outline', href: '#' },
        { label: 'Get Started', icon: 'arrow-right', action: () => console.log('Start') }
      ]"
    >
      <template #badge>
        NEW
      </template>
      <p>This card demonstrates all the features including color, variant, badge, header actions, and footer actions.</p>
    </Card>

    <!-- Card with No Padding Options -->
    <Card 
      title="Card with Custom Padding"
      :no-content-padding="true"
    >
      <div style="background: var(--color-accent); padding: 2rem;">
        This content has its own padding because we disabled the card's content padding.
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from './Card.vue'
</script>