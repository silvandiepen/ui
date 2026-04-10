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
      props: {
        value: "emila/job_123"
      }
    });

    await wrapper.get("button").trigger("click");

    expect(writeText).toHaveBeenCalledWith("emila/job_123");
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: "success",
      title: "Copied successfully",
      message: "emila/job_123"
    }));
    expect(wrapper.text()).toContain("Copied");

    vi.advanceTimersByTime(1500);
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain("Copy");
  });
});
