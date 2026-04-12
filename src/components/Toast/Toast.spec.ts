import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";

import Toast from "./Toast.vue";
import { ToastPosition, ToastType } from "./Toast.model";
import { toastService } from "./Toast.service";

describe("Toast", () => {
  afterEach(() => {
    toastService.toasts.value = [];
  });

  it("renders icon, title, and message for a toast item", () => {
    toastService.toasts.value = [{
      id: "toast-1",
      title: "Saved",
      message: "Changes were stored successfully.",
      type: ToastType.SUCCESS,
      position: ToastPosition.TOP_RIGHT,
      duration: 5000,
      dismissible: true,
      openedTime: Date.now(),
      state: {
        closing: false
      }
    }];

    const wrapper = mount(Toast, {
      global: {
        stubs: {
          Teleport: true,
          TransitionGroup: false,
          Icon: {
            props: ["name"],
            template: '<span class="icon-stub" :data-name="name" />'
          }
        }
      }
    });

    expect(wrapper.text()).toContain("Saved");
    expect(wrapper.text()).toContain("Changes were stored successfully.");
    expect(wrapper.find(".icon-stub").attributes("data-name")).toBe("check-circle");
    expect(wrapper.find(".toast").classes()).toContain("toast--top-right");
  });
});
