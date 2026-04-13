export type VideoPlayerFit = "cover" | "contain";
export type VideoPlayerLoadMode = "eager" | "hover";
export type VideoPlayerPlayMode = "autoplay" | "hover" | "manual";
export type VideoPlayerPlaybackMode = "continuous" | "once";

export interface VideoPlayerProps {
  videoSrc: string;
  imageSrc?: string;
  alt?: string;
  fit?: VideoPlayerFit;
  loadMode?: VideoPlayerLoadMode;
  playMode?: VideoPlayerPlayMode;
  playbackMode?: VideoPlayerPlaybackMode;
  controls?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  preload?: "none" | "metadata" | "auto";
  resetOnLeave?: boolean;
}
