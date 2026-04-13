import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import ReferenceBadge from "./ReferenceBadge.vue";

describe("ReferenceBadge", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the configured value and shows the temporary copied label", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText
      }
    });

    const wrapper = mount(ReferenceBadge, {
      props: {
        label: "emila/job_123",
        copyValue: "emila/job_123"
      }
    });

    const copyButton = wrapper.get('button[title="Copy reference"]');

    await copyButton.trigger("click");

    expect(writeText).toHaveBeenCalledWith("emila/job_123");
    expect(copyButton.attributes("title")).toBe("Copied");

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    expect(wrapper.get("button").attributes("title")).toBe("Copy reference");
  });

  it("renders an external link when a reference URL is provided", () => {
    const wrapper = mount(ReferenceBadge, {
      props: {
        label: "silvandiepen/recipes",
        href: "https://github.com/silvandiepen/recipes"
      }
    });

    expect(wrapper.get("a").attributes("href")).toBe("https://github.com/silvandiepen/recipes");
  });

  it("renders the tooltip outside the clipped surface container", () => {
    const wrapper = mount(ReferenceBadge, {
      props: {
        label: "emila/job_123",
        tooltipText: "Job reference"
      }
    });

    const root = wrapper.get(".reference-badge");
    const surface = wrapper.get(".reference-badge__surface");
    const tooltip = wrapper.get(".reference-badge__tooltip");

    expect(root.element.contains(tooltip.element)).toBe(true);
    expect(surface.element.contains(tooltip.element)).toBe(false);
  });
});
