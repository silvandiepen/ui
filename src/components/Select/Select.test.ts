import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Select from "./Select.vue";

describe("Select", () => {
  it("emits the changed value", async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: ""
      },
      slots: {
        default: `
          <option value="">Choose</option>
          <option value="main">Main</option>
        `
      }
    });

    await wrapper.find("select").setValue("main");

    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["main"]);
  });
});
