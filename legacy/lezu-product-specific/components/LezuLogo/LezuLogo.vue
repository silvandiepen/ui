<template>
  <div :class="bemm(['', size, animated ? 'animated' : ''])">
    <svg
      :class="bemm('svg')"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 139.5 36"
      aria-hidden="true"
      focusable="false"
    >
      <g :class="bemm('letter', 'l')">
        <rect x="0" y="0" width="36" height="36" fill="transparent" />
        <polyline
          :class="bemm('line', ['','l'])"
          points="4.5 0 4.5 31.5 31.5 31.5"
          pathLength="100"
        />
      </g>

      <g :class="bemm('letter', 'e')">
        <rect x="36" y="0" width="36" height="36" fill="transparent" />
        <polyline
          :class="bemm('line', ['','e-shape'])"
          points="67.5 4.5 40.5 4.5 40.5 31.5 67.5 31.5"
          pathLength="100"
        />
        <line
          :class="bemm('line', ['','e-middle'])"
          x1="40.5" y1="18" x2="67.5" y2="18"
          pathLength="100"
        />
      </g>

      <g :class="bemm('letter', 'z')">
        <rect x="68" y="0" width="40" height="36" fill="transparent" />
        <line
          :class="bemm('line', ['','z-top'])"
          x1="72" y1="4.5" x2="103.5" y2="4.5"
          pathLength="100"
        />
        <line
          :class="bemm('line', ['','z-bottom'])"
          x1="72" y1="31.5" x2="103.5" y2="31.5"
          pathLength="100"
        />
        <line
          :class="bemm('line', ['','z-diagonal'])"
          x1="75.17" y1="30.16" x2="100.33" y2="5.83"
          pathLength="100"
        />
      </g>

      <g :class="bemm('letter', 'u')">
        <rect x="108" y="0" width="31.5" height="36" fill="transparent" />
        <path
          :class="bemm('line', ['','u'])"
          d="M112.5,0v20.25c0,6.21,5.04,11.25,11.25,11.25s11.25-5.04,11.25-11.25V0"
          pathLength="100"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm'
import type { LezuLogoProps } from './LezuLogo.model'

const { bemm } = useBemm('lezu-logo')

withDefaults(defineProps<LezuLogoProps>(), {
  animated: false,
  size: 'medium',
})
</script>

<style lang="scss">
.lezu-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;

  --lezu-logo-stroke-full: 9px;
  --lezu-logo-stroke-half: 6px;
  --lezu-logo-stroke-thin: 3px;
  --lezu-logo-stroke-color-full: color-mix(in srgb, currentColor 100%, transparent 0%);
  --lezu-logo-stroke-color-half: color-mix(in srgb, var(--color-primary) 50%, currentColor 50%);
  --lezu-logo-stroke-color-thin: color-mix(in srgb, var(--color-primary) 100%, transparent 0%);

  &--small {
    width: 64px;
  }

  &--medium {
    width: 108px;
  }

  &--large {
    width: 152px;
  }

  &__svg {
    display: block;
    width: 100%;
    height: auto;
  }

  &__line {
    fill: none;
    stroke: var(--lezu-logo-stroke-color-full);
    stroke-miterlimit: 10;
    stroke-width: var(--lezu-logo-stroke-full);
    transition: stroke var(--transition-fast), stroke-width var(--transition-fast);
  }

  &__line--u {
    stroke-linejoin: bevel;
  }

  &--animated &__line {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: lezu-logo-draw-in 1.1s ease-out forwards;
  }

  &--animated &__line--l {
    animation-delay: 0s;
  }

  &--animated &__line--e-shape {
    animation-delay: 0.08s;
  }

  &--animated &__line--e-middle {
    animation-delay: 0.16s;
  }

  &--animated &__line--z-top {
    animation-delay: 0.24s;
  }

  &--animated &__line--z-bottom {
    animation-delay: 0.32s;
  }

  &--animated &__line--z-diagonal {
    animation-delay: 0.4s;
  }

  &--animated &__line--u {
    animation-delay: 0.48s;
  }
}

@keyframes lezu-logo-draw-in {
  0% {
    stroke-dashoffset: 100;
    stroke: var(--color-primary);
  }

  100% {
    stroke-dashoffset: 0;
  }
}
</style>
