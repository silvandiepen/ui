<template>
  <div
    :class="[
      bemm(),
      bemm('', `fit-${fit}`),
      controls ? bemm('', 'has-controls') : '',
      videoVisible ? bemm('', 'video-visible') : ''
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <img
      v-if="imageSrc"
      :class="bemm('image')"
      :src="imageSrc"
      :alt="alt"
      :draggable="false"
      :aria-hidden="videoVisible"
      loading="lazy"
    />

    <video
      ref="videoElement"
      :class="bemm('video')"
      :src="resolvedVideoSrc"
      :poster="imageSrc"
      :controls="controls"
      :loop="shouldLoop"
      :muted="muted"
      :playsinline="playsInline"
      :preload="resolvedPreload"
      :aria-label="alt"
      @loadeddata="handleLoadedData"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
    />
  </div>
</template>

<script lang="ts" setup>
import { useBemm } from "bemm";
import { computed, nextTick, onMounted, ref, watch } from "vue";

import type { VideoPlayerProps } from "./VideoPlayer.model";

defineOptions({
  name: "VideoPlayer"
});

const props = withDefaults(defineProps<VideoPlayerProps>(), {
  alt: "",
  controls: false,
  fit: "cover",
  imageSrc: "",
  loadMode: "eager",
  muted: true,
  playbackMode: "continuous",
  playMode: "autoplay",
  playsInline: true,
  preload: undefined,
  resetOnLeave: false
});

const videoElement = ref<HTMLVideoElement | null>(null);
const bemm = useBemm("video-player", {
  includeBaseClass: true
});

const isHovered = ref(false);
const isPlaying = ref(false);
const isVideoReady = ref(false);
const hasCompletedPlayback = ref(false);
const hasLoadedVideo = ref(false);

const shouldLoadEagerly = computed(() => props.playMode === "autoplay" || props.loadMode === "eager");
const shouldLoop = computed(() => props.playbackMode === "continuous");
const resolvedPreload = computed(() => props.preload ?? (shouldLoadEagerly.value ? "metadata" : "none"));
const resolvedVideoSrc = computed(() => hasLoadedVideo.value ? props.videoSrc : undefined);

const videoVisible = computed(() => {
  if (!props.imageSrc) {
    return true;
  }

  if (!isVideoReady.value) {
    return false;
  }

  if (props.controls || props.playMode === "autoplay") {
    return true;
  }

  if (props.playMode === "hover") {
    return isHovered.value || isPlaying.value || hasCompletedPlayback.value;
  }

  return isPlaying.value || hasCompletedPlayback.value;
});

function initializeState() {
  hasLoadedVideo.value = shouldLoadEagerly.value;
  isVideoReady.value = !props.imageSrc && hasLoadedVideo.value;
  hasCompletedPlayback.value = false;
  isHovered.value = false;
  isPlaying.value = false;
}

async function ensureVideoLoaded() {
  if (hasLoadedVideo.value) {
    return;
  }

  hasLoadedVideo.value = true;
  await nextTick();
  videoElement.value?.load();
}

async function play() {
  if (props.playbackMode === "once" && hasCompletedPlayback.value) {
    return;
  }

  await ensureVideoLoaded();

  if (!videoElement.value) {
    return;
  }

  try {
    await videoElement.value.play();
  } catch {
    // Browser autoplay policies can reject playback requests. Keep the poster visible.
  }
}

function pause() {
  videoElement.value?.pause();
}

function reset() {
  if (!videoElement.value) {
    return;
  }

  pause();
  videoElement.value.currentTime = 0;
  hasCompletedPlayback.value = false;
}

function handleLoadedData() {
  isVideoReady.value = true;

  if (props.playMode === "autoplay" || (props.playMode === "hover" && isHovered.value)) {
    void play();
  }
}

function handlePlay() {
  isPlaying.value = true;
}

function handlePause() {
  isPlaying.value = false;
}

function handleEnded() {
  isPlaying.value = false;
  hasCompletedPlayback.value = true;
}

async function handleMouseEnter() {
  isHovered.value = true;

  if (props.loadMode === "hover") {
    await ensureVideoLoaded();
  }

  if (props.playMode === "hover") {
    await play();
  }
}

function handleMouseLeave() {
  isHovered.value = false;

  if (props.playMode !== "hover" || hasCompletedPlayback.value) {
    return;
  }

  pause();

  if (props.resetOnLeave) {
    reset();
  }
}

watch(
  [() => props.videoSrc, () => props.imageSrc, () => props.loadMode, () => props.playMode, () => props.playbackMode],
  async () => {
    initializeState();
    await nextTick();

    if (hasLoadedVideo.value) {
      videoElement.value?.load();
    }

    if (props.playMode === "autoplay") {
      void play();
    }
  }
);

initializeState();

onMounted(() => {
  if (props.playMode === "autoplay") {
    nextTick(() => {
      void play();
    });
  }
});

defineExpose({
  element: videoElement,
  load: ensureVideoLoaded,
  pause,
  play,
  reset
});
</script>

<style lang="scss">
.video-player {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-background), var(--color-foreground) 3%);

  &__image,
  &__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__image {
    z-index: 1;
    transition: opacity 180ms ease;
  }

  &__video {
    z-index: 2;
    opacity: 0;
    transition: opacity 180ms ease;
  }

  &--video-visible &__image {
    opacity: 0;
    pointer-events: none;
  }

  &--video-visible &__video {
    opacity: 1;
  }

  &--fit-contain {
    .video-player__image,
    .video-player__video {
      object-fit: contain;
    }
  }
}
</style>
