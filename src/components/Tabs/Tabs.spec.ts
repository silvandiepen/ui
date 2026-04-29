import { h, nextTick } from "vue";
import { mount } from "@vue/test-utils";
import Tabs from "@/components/ui/Tabs/Tabs.vue";
import TabPane from "@/components/ui/Tabs/TabPane.vue";

const makeWrapper = (propsData: Record<string, unknown> = {}) =>
  mount(Tabs, {
    propsData,
    slots: {
      default: () => [
        h(TabPane, { id: "one", title: "One" }, { default: () => "Tab one" }),
        h(TabPane, { id: "two", title: "Two" }, { default: () => "Tab two" }),
      ],
    },
    stubs: {
      Card: {
        template: "<div><slot /></div>",
      },
    },
  });

describe("Tabs", () => {
  it("activates first tab by default", async () => {
    const wrapper = makeWrapper();

    await nextTick();
    await nextTick();

    expect(wrapper.find("#one").exists()).toBe(true);
    expect(wrapper.find("#two").exists()).toBe(false);
  });

  it("forwards underline navigation variant and sticky navigation state", async () => {
    const wrapper = makeWrapper({
      stickyNavigation: true,
      tabNavigationVariant: "underline",
    });

    await nextTick();

    expect(wrapper.classes()).toContain("ui-tabs--sticky-navigation");
    expect(wrapper.find(".ui-tab-nav").classes()).toContain(
      "ui-tab-nav--variant-underline",
    );
  });

  it("activates tab from navigation click and emits events", async () => {
    const wrapper = makeWrapper();

    await nextTick();
    await wrapper.findAll(".ui-tab-nav__button")[1].trigger("click");
    await nextTick();

    expect(wrapper.find("#two").exists()).toBe(true);
    expect(wrapper.emitted("tab-click")?.map((event) => event[0])).toContain(
      "two",
    );
    expect(wrapper.emitted("input")?.map((event) => event[0])).toContain("two");
  });

  it("syncs with value prop updates", async () => {
    const wrapper = makeWrapper({ value: "two" });

    await nextTick();
    await nextTick();
    expect(wrapper.find("#two").exists()).toBe(true);

    await wrapper.setProps({ value: "one" });
    await nextTick();

    expect(wrapper.find("#one").exists()).toBe(true);
    expect(wrapper.find("#two").exists()).toBe(false);
  });
});
