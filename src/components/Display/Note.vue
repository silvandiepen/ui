<template>
	<div :class="bemm('', [type ? 'has-status' : '', type || ''])">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { useBemm } from 'bemm';
import { NotificationStatus } from '@/types';

type NoteType =
	| (typeof NotificationStatus)[keyof typeof NotificationStatus]
	| 'danger';

defineProps({
	type: {
		type: String as PropType<NoteType | null>,
		default: null,
	},
});

const bemm = useBemm('note-view', {
	return: 'string',
	includeBaseClass: true,
});
</script>

<style lang="scss">
.note-view {
	border: 1px solid
		var(--note-border-color, var(--int-note-border-color, var(--color-primary)));
	border-radius: var(
		--note-border-radius,
		var(--int-note-border-radius, var(--border-radius))
	);
	padding: var(--note-padding, var(--int-note-padding, var(--space-m)));
	background-color: var(
		--note-background-color,
		var(
			--int-note-background-color,
			color-mix(in srgb, var(--color-primary, transparent 90%))
		)
	);
	color: var(
		--note-text-color,
		var(--int-note-text-color, var(--color-foreground))
	);
	font-size: var(
		--note-font-size,
		var(--int-note-font-size, var(--font-size-medium))
	);

	&--info {
		--note-color: var(--color-info);
	}

	&--danger,
	&--warning {
		--note-color: var(--color-warning);
	}

	&--error {
		--note-color: var(--color-error);
	}

	&--success {
		--note-color: var(--color-success);
	}

	&--has-status {
		--int-note-border-color: var(--note-color);
		--int-note-background-color: color-mix(
			in srgb,
			var(--note-color),
			var(--color-background) 90%
		);
		--int-note-text-color: color-mix(
			in srgb,
			var(--note-color),
			var(--color-foreground) 20%
		);
	}
}
</style>
