<template>
  <Example>
<div :class="bemm()">
    <section :class="bemm('section')">
      <p :class="bemm('label')">Single item (default)</p>
      <Carousel>
        <div v-for="slide in slides" :key="slide.title" :class="bemm('slide')">
          <strong>{{ slide.title }}</strong>
          <span>{{ slide.body }}</span>
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Multiple items visible</p>
      <Carousel :items-to-show="3" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Responsive items to show (1 → 2 → 3 → 4)</p>
      <Carousel :items-to-show="{ default: 1, s: 2, m: 3, l: 4 }" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">No navigation, indicators only</p>
      <Carousel :show-navigation="false" :items-to-show="2" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Navigation outside</p>
      <Carousel navigation-position="outside" :items-to-show="2" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Autoplay with loop (4s interval)</p>
      <Carousel autoplay :loop="true" :autoplay-interval="4000" :items-to-show="2" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">No indicators, scroll 2 at a time</p>
      <Carousel :show-indicators="false" :items-to-scroll="2" :items-to-show="3" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>

    <section :class="bemm('section')">
      <p :class="bemm('label')">Vertical carousel</p>
      <Carousel vertical height="12rem" :items-to-show="2" gap="var(--space-s)">
        <div v-for="card in cards" :key="card" :class="bemm('card')">
          {{ card }}
        </div>
      </Carousel>
    </section>
  </div>
  </Example>
</template>

<script setup lang="ts">
import { useBemm } from 'bemm'
import Carousel from './Carousel.vue'

const bemm = useBemm('carousel-example')

const slides = [
  { title: 'Slide 1', body: 'Full-width content area' },
  { title: 'Slide 2', body: 'CSS scroll-snap powered' },
  { title: 'Slide 3', body: 'Smooth and performant' },
  { title: 'Slide 4', body: 'Fully customizable' },
]

const cards = [
  'Analytics',
  'Reports',
  'Dashboard',
  'Settings',
  'Users',
  'Billing',
  'Integrations',
  'Security',
]
</script>

<style lang="scss">
.carousel-example {
  display: grid;
  gap: var(--space-xl);

  &__section {
    display: grid;
    gap: var(--space-xs);
  }

  &__label {
    margin: 0;
    color: color-mix(in srgb, var(--color-foreground), transparent 35%);
    font-size: var(--font-size-s);
  }

  &__slide {
    min-width: 0;
    padding: var(--space-l);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-primary), transparent 88%);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    align-items: center;
    justify-content: center;
    min-height: 10rem;

    strong {
      font-size: var(--font-size-l);
    }
  }

  &__card {
    flex: 0 0 calc(var(--carousel-item-width) - var(--carousel-gap));
    min-width: 0;
    padding: var(--space) var(--space-m);
    border-radius: var(--border-radius);
    background: color-mix(in srgb, var(--color-foreground), transparent 92%);
    font-weight: 600;
    text-align: center;
    box-sizing: border-box;
  }
}
</style>
