<template>
  <div
    :class="carouselClasses"
    :style="carouselStyle"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <div
      ref="viewportRef"
      :class="bemm('viewport')"
      @scroll="onScroll"
    >
      <div :class="bemm('track')">
        <slot />
      </div>
    </div>

    <button
      v-if="showNavigation && canScrollPrev"
      :class="[bemm('nav'), bemm('nav', 'prev')]"
      :disabled="!canScrollPrev"
      aria-label="Previous"
      @click="scrollPrev"
    >
      <slot name="prev-icon">
        <Icon name="chevron-left" size="medium" />
      </slot>
    </button>

    <button
      v-if="showNavigation && canScrollNext"
      :class="[bemm('nav'), bemm('nav', 'next')]"
      :disabled="!canScrollNext"
      aria-label="Next"
      @click="scrollNext"
    >
      <slot name="next-icon">
        <Icon name="chevron-right" size="medium" />
      </slot>
    </button>

    <div v-if="showIndicators && totalPages > 1" :class="[bemm('indicators')]">
      <button
        v-for="page in totalPages"
        :key="page"
        :class="[bemm('indicator'), currentPage === page - 1 && bemm('indicator', 'active')]"
        :aria-label="`Go to slide ${page}`"
        @click="scrollToPage(page - 1)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import Icon from '../Icon/Icon.vue'
import type { CarouselEmits, CarouselProps } from './Carousel.model'

const props = withDefaults(defineProps<CarouselProps>(), {
  itemsToShow: 1,
  itemsToScroll: 1,
  gap: 'var(--space)',
  showNavigation: true,
  showIndicators: true,
  navigationPosition: 'overlay',
  indicatorsPosition: 'inside',
  autoplay: false,
  autoplayInterval: 4000,
  pauseOnHover: true,
  loop: false,
  snapAlign: 'start',
  height: undefined,
  vertical: false,
})

const emit = defineEmits<CarouselEmits>()

const bemm = useBemm('carousel')

const viewportRef = ref<HTMLElement | null>(null)
const isPaused = ref(false)
const autoplayTimer = ref<ReturnType<typeof setInterval> | null>(null)
const canScrollPrev = ref(true)
const canScrollNext = ref(true)
const currentPage = ref(0)
const totalPages = ref(0)
const itemCount = ref(0)

const resolvedItemsToShow = computed(() => {
  if (typeof props.itemsToShow === 'number') return props.itemsToShow
  const map = props.itemsToShow
  if (map.default) return map.default
  const w = window.innerWidth
  if (w >= 1440 && map.xl) return map.xl
  if (w >= 1024 && map.l) return map.l
  if (w >= 768 && map.m) return map.m
  if (w >= 480 && map.s) return map.s
  return map.default || 1
})

const itemWidthPercent = computed(() => 100 / resolvedItemsToShow.value)

const carouselClasses = computed(() => [
  bemm(),
  bemm('', props.navigationPosition),
  bemm('', props.indicatorsPosition),
  props.vertical ? bemm('', 'vertical') : bemm('', 'horizontal'),
  canScrollPrev.value ? bemm('', 'has-prev') : '',
  canScrollNext.value ? bemm('', 'has-next') : '',
])

const carouselStyle = computed(() => ({
  '--carousel-gap': props.gap,
  '--carousel-item-width': `${itemWidthPercent.value}%`,
  ...(props.height ? { height: props.height } : {}),
}))

function getItemElements(): HTMLElement[] {
  if (!viewportRef.value) return []
  const track = viewportRef.value.querySelector('.carousel__track')
  if (!track) return []
  return Array.from(track.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement
  )
}

function measure() {
  const items = getItemElements()
  itemCount.value = items.length
  const shown = resolvedItemsToShow.value
  const pages = Math.max(1, Math.ceil((items.length - shown + props.itemsToScroll) / props.itemsToScroll))
  totalPages.value = pages
  updateScrollState()
}

function updateScrollState() {
  const el = viewportRef.value
  if (!el) return

  if (props.vertical) {
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight)
    canScrollPrev.value = el.scrollTop > 2
    canScrollNext.value = el.scrollTop < maxScroll - 2
  } else {
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth)
    canScrollPrev.value = el.scrollLeft > 2
    canScrollNext.value = el.scrollLeft < maxScroll - 2
  }

  updateCurrentPage()
}

function updateCurrentPage() {
  const el = viewportRef.value
  if (!el || totalPages.value <= 1) {
    currentPage.value = 0
    return
  }

  const items = getItemElements()
  if (items.length === 0) return

  const scrollPos = props.vertical ? el.scrollTop : el.scrollLeft
  const itemSize = props.vertical
    ? items[0].offsetHeight + parseFloat(getComputedStyle(el).gap || '0')
    : items[0].offsetWidth + parseFloat(getComputedStyle(el).gap || '0')

  if (itemSize > 0) {
    currentPage.value = Math.min(
      Math.round(scrollPos / (itemSize * props.itemsToScroll)),
      totalPages.value - 1
    )
  }
}

function onScroll() {
  updateScrollState()
}

function scrollToPage(page: number) {
  const el = viewportRef.value
  if (!el) return

  const items = getItemElements()
  if (items.length === 0) return

  const targetIndex = Math.min(page * props.itemsToScroll, items.length - resolvedItemsToShow.value)
  const targetItem = items[Math.max(0, targetIndex)]
  if (!targetItem) return

  targetItem.scrollIntoView({
    behavior: 'smooth',
    block: props.vertical ? 'start' : 'nearest',
    inline: props.vertical ? 'nearest' : 'start',
  })

  emit('slide', targetIndex)
}

function scrollPrev() {
  const el = viewportRef.value
  if (!el) return

  const items = getItemElements()
  if (items.length === 0) return

  const scrollAmount = props.vertical ? el.clientHeight : el.clientWidth
  const currentScroll = props.vertical ? el.scrollTop : el.scrollLeft

  const targetScroll = currentScroll - (scrollAmount / resolvedItemsToShow.value) * props.itemsToScroll

  if (props.loop && targetScroll < 0) {
    el.scrollTo({
      [props.vertical ? 'top' : 'left']: el[props.vertical ? 'scrollHeight' : 'scrollWidth'] - el[props.vertical ? 'clientHeight' : 'clientWidth'],
      behavior: 'smooth',
    })
  } else if (props.vertical) {
    el.scrollBy({ top: -(scrollAmount / resolvedItemsToShow.value) * props.itemsToScroll, behavior: 'smooth' })
  } else {
    el.scrollBy({ left: -(scrollAmount / resolvedItemsToShow.value) * props.itemsToScroll, behavior: 'smooth' })
  }

  emit('prev')
}

function scrollNext() {
  const el = viewportRef.value
  if (!el) return

  const items = getItemElements()
  if (items.length === 0) return

  const scrollAmount = props.vertical ? el.clientHeight : el.clientWidth
  const maxScroll = props.vertical
    ? el.scrollHeight - el.clientHeight
    : el.scrollWidth - el.clientWidth
  const currentScroll = props.vertical ? el.scrollTop : el.scrollLeft

  if (props.loop && currentScroll >= maxScroll - 2) {
    el.scrollTo({ [props.vertical ? 'top' : 'left']: 0, behavior: 'smooth' })
  } else if (props.vertical) {
    el.scrollBy({ top: (scrollAmount / resolvedItemsToShow.value) * props.itemsToScroll, behavior: 'smooth' })
  } else {
    el.scrollBy({ left: (scrollAmount / resolvedItemsToShow.value) * props.itemsToScroll, behavior: 'smooth' })
  }

  emit('next')
}

function startAutoplay() {
  if (!props.autoplay) return
  stopAutoplay()
  autoplayTimer.value = setInterval(() => {
    if (isPaused.value) return
    if (!canScrollNext.value && !props.loop) {
      if (props.loop) {
        const el = viewportRef.value
        if (el) el.scrollTo({ [props.vertical ? 'top' : 'left']: 0, behavior: 'smooth' })
      }
      return
    }
    scrollNext()
  }, props.autoplayInterval)
}

function stopAutoplay() {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value)
    autoplayTimer.value = null
  }
}

function pauseAutoplay() {
  if (props.pauseOnHover) isPaused.value = true
}

function resumeAutoplay() {
  if (props.pauseOnHover) isPaused.value = false
}

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

onMounted(() => {
  nextTick(() => {
    measure()
    startAutoplay()
  })

  if (typeof ResizeObserver !== 'undefined' && viewportRef.value) {
    resizeObserver = new ResizeObserver(() => measure())
    resizeObserver.observe(viewportRef.value)
  }

  if (typeof MutationObserver !== 'undefined' && viewportRef.value) {
    mutationObserver = new MutationObserver(() => nextTick(measure))
    mutationObserver.observe(viewportRef.value, { childList: true, subtree: true })
  }

  window.addEventListener('resize', measure)
})

onBeforeUnmount(() => {
  stopAutoplay()
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
  window.removeEventListener('resize', measure)
})

watch(
  () => [props.itemsToShow, props.itemsToScroll, props.vertical, props.gap],
  () => nextTick(measure),
)
</script>

<style lang="scss">
.carousel {
  position: relative;
  width: 100%;
  --carousel-nav-size: 2.5em;
  --carousel-indicator-size: 0.5em;

  &__viewport {
    overflow: hidden;
    width: 100%;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &--horizontal &__viewport {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
  }

  &--vertical &__viewport {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    height: var(--carousel-height, auto);
  }

  &__track {
    display: flex;
    gap: var(--carousel-gap);

    > * {
      flex: 0 0 calc(var(--carousel-item-width) - var(--carousel-gap) + (var(--carousel-gap) / var(--carousel-items-count, 1)));
      scroll-snap-align: var(--carousel-snap-align, start);
      scroll-snap-stop: always;
      min-width: 0;
    }
  }

  &--horizontal &__track {
    flex-direction: row;
  }

  &--vertical &__track {
    flex-direction: column;

    > * {
      flex: 0 0 auto;
    }
  }

  // Navigation buttons
  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: var(--carousel-nav-size);
    height: var(--carousel-nav-size);
    border-radius: var(--border-radius-round);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 85%);
    background: color-mix(in srgb, var(--color-background), transparent 10%);
    color: var(--color-foreground);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 90%);
      border-color: var(--color-foreground);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  &__nav--prev {
    left: var(--space-s);
  }

  &__nav--next {
    right: var(--space-s);
  }

  &--vertical &__nav {
    top: auto;
    left: 50%;
    transform: translateX(-50%);
    right: auto;

    &.carousel__nav--prev {
      top: var(--space-s);
      left: 50%;
    }

    &.carousel__nav--next {
      bottom: var(--space-s);
      top: auto;
    }
  }

  // Navigation positions
  &--outside {
    padding-inline: calc(var(--carousel-nav-size) + var(--space-s));

    .carousel__nav--prev {
      left: 0;
    }

    .carousel__nav--next {
      right: 0;
    }
  }

  &--inside {
    .carousel__nav--prev {
      left: var(--space-s);
    }

    .carousel__nav--next {
      right: var(--space-s);
    }
  }

  &--overlay {
    .carousel__nav {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover .carousel__nav,
    &:focus-within .carousel__nav {
      opacity: 1;
    }
  }

  // Indicators
  &__indicators {
    display: flex;
    justify-content: center;
    gap: var(--space-xs);
    padding: var(--space-s) 0;
  }

  &__indicator {
    width: var(--carousel-indicator-size);
    height: var(--carousel-indicator-size);
    border-radius: var(--border-radius-round);
    border: none;
    background: color-mix(in srgb, var(--color-foreground), transparent 70%);
    cursor: pointer;
    padding: 0;
    transition: all 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--color-foreground), transparent 50%);
    }

    &--active {
      background: var(--color-foreground);
      transform: scale(1.3);
    }
  }

  // Indicators positions
  &--inside &__indicators {
    position: absolute;
    bottom: var(--space-s);
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    padding: 0;
  }

  &--outside &__indicators {
    padding: var(--space-s) 0;
  }

  // Vertical indicators
  &--vertical &__indicators {
    position: absolute;
    flex-direction: column;
    right: var(--space-xs);
    top: 50%;
    transform: translateY(-50%);
    bottom: auto;
    left: auto;
    padding: 0;
  }

  // Hide nav when not scrollable
  &:not(&--has-prev):not(&--has-next) {
    .carousel__nav {
      display: none;
    }
  }

  &:not(&--has-prev) {
    .carousel__nav--prev {
      display: none;
    }
  }

  &:not(&--has-next) {
    .carousel__nav--next {
      display: none;
    }
  }
}
</style>
