import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import StatusBadge from "./StatusBadge.vue";

describe("StatusBadge", () => {
  it("renders the provided label", () => {
    const wrapper = mount(StatusBadge, {
      props: {
        label: "Preview ready",
        tone: "success"
      }
    });

    expect(wrapper.text()).toContain("Preview ready");
    expect(wrapper.attributes("style")).toContain("--status-badge-color: var(--color-success)");
  });
});
