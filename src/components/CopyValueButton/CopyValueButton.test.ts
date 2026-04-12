import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import { toastService } from "@ui/components/Toast";

import CopyValueButton from "./CopyValueButton.vue";

describe("CopyValueButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("copies the value and raises a success toast", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", {
      clipboard: {
        writeText
      }
    });
    const toastSpy = vi.spyOn(toastService, "show");

    const wrapper = mount(CopyValueButton, {
      global: {
        stubs: {
          Icon: {
            props: ["name"],
            template: '<span class="icon-stub" :data-name="name" />'
          }
        }
      },
      props: {
        value: "emila/job_123"
      }
    });

    expect(wrapper.get(".icon-stub").attributes("data-name")).toBe("clipboard");
    expect(wrapper.get("button").classes()).not.toContain("copy-value-button--copied");

    await wrapper.get("button").trigger("click");

    expect(writeText).toHaveBeenCalledWith("emila/job_123");
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: "success",
      title: "Copied successfully",
      message: "emila/job_123"
    }));
    expect(wrapper.get(".icon-stub").attributes("data-name")).toBe("check");
    expect(wrapper.get("button").classes()).toContain("copy-value-button--copied");
    expect(wrapper.get("button").attributes("aria-label")).toBe("Copied");

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    expect(wrapper.get(".icon-stub").attributes("data-name")).toBe("clipboard");
    expect(wrapper.get("button").classes()).not.toContain("copy-value-button--copied");
    expect(wrapper.get("button").attributes("aria-label")).toBe("Copy");
  });
});
