<template>
  <Example>
    <div :style="demoStyles.wrapper">
      <section :style="demoStyles.section">
        <div :style="demoStyles.intro">
          <h2 :style="demoStyles.heading">Variants</h2>
          <p :style="demoStyles.copy">
            The card component supports three surface treatments: <code>default</code>, <code>elevated</code>, and <code>ghost</code>.
          </p>
        </div>

        <div :style="demoStyles.grid">
          <Card
            v-for="variantCard in variantCards"
            :key="variantCard.variant"
            :title="variantCard.title"
            :description="variantCard.description"
            :variant="variantCard.variant"
          >
            <p :style="demoStyles.copy">{{ variantCard.body }}</p>
          </Card>
        </div>
      </section>

      <section :style="demoStyles.section">
        <div :style="demoStyles.intro">
          <h2 :style="demoStyles.heading">Compositions</h2>
          <p :style="demoStyles.copy">
            Header actions, footer actions, badges, color accents, and padding controls can be mixed without adding wrapper markup.
          </p>
        </div>

        <div :style="demoStyles.grid">
          <Card
            title="With Header Actions"
            description="Use icon-only actions for compact card controls."
            :header-actions="headerActions"
          >
            <p :style="demoStyles.copy">
              Keep secondary actions in the header when the card content should remain visually quiet.
            </p>
          </Card>

          <Card
            title="With Footer Actions"
            description="Footer actions work well for commit or cancel flows."
            :footer-actions="footerActions"
          >
            <p :style="demoStyles.copy">
              Footer actions span the full width and inherit the card rhythm automatically.
            </p>
          </Card>

          <Card
            title="Featured Accent"
            description="Feature a primary action or premium plan with stronger affordances."
            variant="elevated"
            :color="Colors.PRIMARY"
            badge="Popular"
            badge-color="primary"
            featured
            hoverable
          >
            <p :style="demoStyles.copy">
              Combine <code>featured</code>, <code>color</code>, and <code>badge</code> when a card should stand out in a grid.
            </p>
          </Card>

          <Card
            title="No Content Padding"
            description="Disable internal padding when the slotted content owns its own layout."
            :no-content-padding="true"
          >
            <div :style="demoStyles.mediaPanel">
              Custom content block with full-bleed treatment.
            </div>
          </Card>

          <Card>
            <template #header>
              <div :style="demoStyles.customHeader">
                <strong>Custom Header Slot</strong>
                <span :style="demoStyles.eyebrow">Flexible layout</span>
              </div>
            </template>

            <p :style="demoStyles.copy">
              Switch to named slots when title and description props are not expressive enough.
            </p>

            <template #footer>
              <div :style="demoStyles.customFooter">
                <span>Custom footer content</span>
                <span :style="demoStyles.eyebrow">Slots stay fully controlled</span>
              </div>
            </template>
          </Card>
        </div>
      </section>
    </div>
  </Example>
</template>

<script lang="ts" setup>
import type { Action } from "../Actions";

import { Colors } from "../../types";
import Card from "./Card.vue";

const noop = () => undefined;

const variantCards = [
  {
    variant: "default",
    title: "Default",
    description: "Balanced bordered surface for most panels.",
    body: "Use the default treatment for settings sections, dashboard widgets, and grouped content."
  },
  {
    variant: "elevated",
    title: "Elevated",
    description: "Adds a subtle shadow for more hierarchy.",
    body: "Use elevated cards when the surface needs more separation from the page background."
  },
  {
    variant: "ghost",
    title: "Ghost",
    description: "Removes the surface chrome and keeps the structure.",
    body: "Use ghost cards when the layout still needs card semantics without visible framing."
  }
] as const;

const headerActions = [
  { icon: "edit", label: "Edit", action: noop },
  { icon: "trash", label: "Delete", action: noop }
] satisfies Action[];

const footerActions = [
  { label: "Cancel", variant: "outline", action: noop },
  { label: "Save", action: noop }
] satisfies Action[];

const demoStyles = {
  wrapper: {
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  intro: {
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem"
  },
  heading: {
    margin: "0",
    fontSize: "1.25rem"
  },
  grid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))"
  },
  copy: {
    margin: "0",
    lineHeight: "1.5"
  },
  mediaPanel: {
    background: "color-mix(in srgb, var(--color-primary), transparent 88%)",
    padding: "2rem",
    minHeight: "8rem",
    display: "grid",
    placeItems: "center",
    fontWeight: "600"
  },
  customHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    width: "100%"
  },
  customFooter: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem"
  },
  eyebrow: {
    color: "var(--color-foreground-muted)",
    fontSize: "0.875rem"
  }
} as const;
</script>
