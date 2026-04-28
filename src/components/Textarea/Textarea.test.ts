import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Textarea from "./Textarea.vue";

describe("Textarea", () => {
  it("applies the shared textarea class", () => {
    const wrapper = mount(Textarea);

    expect(wrapper.find("textarea").classes()).toContain("ui-textarea");
  });

  it("emits updates from textarea input", async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: ""
      }
    });

    await wrapper.find("textarea").setValue("Hello");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Hello"]);
  });

  it("renders a test id on the textarea", () => {
    const wrapper = mount(Textarea, {
      props: {
        testId: "notes"
      }
    });

    expect(wrapper.find('textarea[data-test-id="notes"]').exists()).toBe(true);
  });
});
