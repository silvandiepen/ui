import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Textarea from "./Textarea.vue";

describe("Textarea", () => {
  it("emits updates from textarea input", async () => {
    const wrapper = mount(Textarea, {
      props: {
        modelValue: ""
      }
    });

    await wrapper.find("textarea").setValue("Hello");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["Hello"]);
  });
});
