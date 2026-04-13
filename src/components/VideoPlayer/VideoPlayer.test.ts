import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import VideoPlayer from "./VideoPlayer.vue";

describe("VideoPlayer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("defers video loading until hover when configured", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const load = vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);

    const wrapper = mount(VideoPlayer, {
      props: {
        imageSrc: "/poster.jpg",
        loadMode: "hover",
        playMode: "hover",
        videoSrc: "/preview.mp4"
      }
    });

    expect(wrapper.get("video").attributes("src")).toBeUndefined();

    await wrapper.trigger("mouseenter");
    await wrapper.vm.$nextTick();

    expect(load).toHaveBeenCalled();
    expect(play).toHaveBeenCalled();
    expect(wrapper.get("video").attributes("src")).toBe("/preview.mp4");
  });

  it("supports contain fit and visible controls", () => {
    const wrapper = mount(VideoPlayer, {
      props: {
        controls: true,
        fit: "contain",
        imageSrc: "/poster.jpg",
        videoSrc: "/preview.mp4"
      }
    });

    expect(wrapper.classes()).toContain("video-player--fit-contain");
    expect(wrapper.classes()).toContain("video-player--has-controls");
    expect(wrapper.get("video").attributes("controls")).toBeDefined();
  });

  it("does not replay hover-driven playback after finishing in once mode", async () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);

    const wrapper = mount(VideoPlayer, {
      props: {
        imageSrc: "/poster.jpg",
        loadMode: "hover",
        playMode: "hover",
        playbackMode: "once",
        videoSrc: "/preview.mp4"
      }
    });

    await wrapper.trigger("mouseenter");
    await wrapper.vm.$nextTick();
    play.mockClear();

    await wrapper.get("video").trigger("ended");
    await wrapper.trigger("mouseleave");
    await wrapper.trigger("mouseenter");

    expect(play).not.toHaveBeenCalled();
    expect(wrapper.classes()).toContain("video-player--video-visible");
  });
});
