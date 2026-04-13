import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Tooltip from './Tooltip.vue';

describe('Tooltip', () => {
  it('uses parent-hover closed defaults', () => {
    const wrapper = mount(Tooltip, { props: { text: 'Hello' } });
    const tooltip = wrapper.get('[role="tooltip"]');

    expect(tooltip.text()).toContain('Hello');
    expect(tooltip.classes()).toContain('ui-tooltip__panel--closed');
    expect(tooltip.classes()).toContain('ui-tooltip__panel--parent-hover');
  });

  it('is hidden when disabled', () => {
    const wrapper = mount(Tooltip, { props: { text: 'Hello', disabled: true } });
    expect(wrapper.find('[role="tooltip"]').exists()).toBe(false);
  });
});
