import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PlatformFooter from "./PlatformFooter.vue";

describe("PlatformFooter", () => {
  it("renders brand, nav, meta, and secondary content", () => {
    const wrapper = mount(PlatformFooter, {
      slots: {
        brand: "<a class='brand-link'>Brand</a>",
        nav: "<nav class='footer-nav'>Nav</nav>",
        meta: "<div class='footer-meta'>Meta</div>",
        secondary: "<div class='footer-secondary'>Secondary</div>"
      }
    });

    expect(wrapper.find(".brand-link").exists()).toBe(true);
    expect(wrapper.find(".footer-nav").exists()).toBe(true);
    expect(wrapper.find(".footer-meta").exists()).toBe(true);
    expect(wrapper.find(".footer-secondary").exists()).toBe(true);
  });

  it("falls back to the default slot inside the secondary row", () => {
    const wrapper = mount(PlatformFooter, {
      slots: {
        default: "<p class='footer-copy'>Shared footer copy</p>"
      }
    });

    expect(wrapper.find(".platform-footer__secondary").exists()).toBe(true);
    expect(wrapper.find(".footer-copy").exists()).toBe(true);
  });

  it("applies the compact modifier", () => {
    const wrapper = mount(PlatformFooter, {
      props: {
        compact: true
      }
    });

    expect(wrapper.classes()).toContain("platform-footer--compact");
  });

  it("applies an explicit color mode modifier", () => {
    const wrapper = mount(PlatformFooter, {
      props: {
        colorMode: "inverse"
      }
    });

    expect(wrapper.classes()).toContain("platform-footer--color-mode-inverse");
  });
});
