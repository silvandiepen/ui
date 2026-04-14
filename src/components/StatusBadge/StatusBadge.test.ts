import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { Status } from '../../types'

import StatusBadge from "./StatusBadge.vue";

describe("StatusBadge", () => {
  it("renders the provided label", () => {
    const wrapper = mount(StatusBadge, {
      props: {
        label: "Preview ready",
        tone: Status.SUCCESS
      }
    });

    expect(wrapper.text()).toContain("Preview ready");
    expect(wrapper.attributes("style")).toContain("--status-badge-color: var(--color-success)");
  });

  it('uses the error status palette', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        label: 'Failed',
        tone: Status.ERROR,
      },
    })

    expect(wrapper.attributes('style')).toContain('--status-badge-color: var(--color-error)')
  })

  it('treats the default status as the muted badge', () => {
    const wrapper = mount(StatusBadge, {
      props: {
        label: 'Draft',
        tone: Status.DEFAULT,
      },
    })

    expect(wrapper.attributes('style')).toContain('--status-badge-color: var(--color-foreground)')
  })
});
