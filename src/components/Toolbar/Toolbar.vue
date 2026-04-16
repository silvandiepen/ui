<template>
	<Teleport to="body">
		<div v-if="toolbars.length" :class="bemm()">
			<TransitionGroup name="toolbar-shell" :class="bemm('stack')" tag="div">
				<div
					v-for="toolbar in toolbars"
					:key="toolbar.id"
					:class="bemm('item', [toolbar.state.closing ? 'closing' : ''])"
					:style="toolbarStyles(toolbar)"
				>
					<div :class="bemm('inner')" data-row-click-stop>
						<component :is="toolbar.component" v-bind="toolbar.props" />
					</div>
				</div>
			</TransitionGroup>
		</div>
	</Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBemm } from 'bemm';
import { toolbarService } from './Toolbar.service';
import type { ToolbarInstance } from './Toolbar.model';

const bemm = useBemm('ui-toolbar-shell');

const toolbars = computed(() => toolbarService.toolbars.value);
const toolbarStyles = (toolbar: ToolbarInstance) => ({
	'--toolbar-z-index': String(toolbar.config.zIndex),
});
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-toolbar-shell {
	@include m.component-props((
		'z-index': '70',
		'max-width': 'min(1280px, 100%)',
		'blur': '8px',
		'shadow': '0 18px 48px color-mix(in srgb, var(--color-foreground), transparent 78%)',
		'slide-offset': '16px',
	), 'ui-toolbar-shell');

	position: fixed;
	left: 0;
	right: 0;
	bottom: var(--space);
	z-index: var(--int-ui-toolbar-shell-z-index);
	pointer-events: none;
	padding: 0 var(--space);

	&__stack {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		gap: var(--space-s);
	}

	&__item {
		pointer-events: none;
		display: flex;
		justify-content: center;
		width: 100%;
		z-index: var(--toolbar-z-index, 70);
	}

	&__inner {
		pointer-events: auto;
		width: fit-content;
		max-width: var(--int-ui-toolbar-shell-max-width);
		border-radius: var(--border-radius-xxl);
		background: color-mix(in srgb, var(--color-background), transparent 8%);
		box-shadow: var(--int-ui-toolbar-shell-shadow);
		backdrop-filter: blur(var(--int-ui-toolbar-shell-blur));
		padding: var(--space);
		overflow: visible;
	}

	&__item--closing {
		pointer-events: none;
	}
}

.toolbar-shell-enter-active,
.toolbar-shell-leave-active {
	transition:
		opacity 180ms ease,
		transform 220ms ease;
}

.toolbar-shell-enter-from,
.toolbar-shell-leave-to {
	opacity: 0;
	transform: translateY(var(--int-ui-toolbar-shell-slide-offset));
}
</style>
