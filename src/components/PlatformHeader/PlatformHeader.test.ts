import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PlatformHeader from "./PlatformHeader.vue";

describe("PlatformHeader", () => {
  it("renders brand, nav, actions, and secondary slots", () => {
    const wrapper = mount(PlatformHeader, {
      slots: {
        brand: "<a class='brand-link'>Brand</a>",
        nav: "<nav class='main-nav'>Nav</nav>",
        actions: "<button class='action-button'>Action</button>",
        secondary: "<div class='secondary-panel'>Secondary</div>"
      }
    });

    expect(wrapper.find(".brand-link").exists()).toBe(true);
    expect(wrapper.find(".main-nav").exists()).toBe(true);
    expect(wrapper.find(".action-button").exists()).toBe(true);
    expect(wrapper.find(".secondary-panel").exists()).toBe(true);
  });

  it("applies compact and mobile-open modifiers", () => {
    const wrapper = mount(PlatformHeader, {
      props: {
        compact: true,
        mobileOpen: true
      }
    });

    expect(wrapper.classes()).toContain("platform-header--compact");
    expect(wrapper.classes()).toContain("platform-header--mobile-open");
  });
});
