<template>
	<div :class="bemm('')">
		<Icon :class="bemm('icon')" :name="icon" aria-hidden="true">-</Icon>
		<p :class="bemm('message')">{{ message }}</p>
		<Button v-if="action" v-bind="actionButtonProps" @click="action.action">
			{{ action.label }}
		</Button>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBemm } from 'bemm';
import { Icon, Icons } from '@/components/ui/Icon';
import type { PropType } from 'vue';
import { type IconType } from '@/components/ui/Icon';
import { Button } from '@/components/ui/Button';
import type { ButtonProps } from '@/components/ui/Button';

const props = defineProps({
	message: {
		type: String,
		default: 'No values found',
	},
	icon: {
		type: String as PropType<IconType>,
		default: Icons.BOX,
	},
	action: {
		type: Object as PropType<
			Partial<ButtonProps> & { label: string; action: () => void }
		>,
		default: null,
	},
});

const actionButtonProps = computed(() => {
	if (!props.action) {
		return {};
	}

	const { action, label, ...buttonProps } = props.action;
	return buttonProps;
});

const bemm = useBemm('ui-empty', {
	return: 'string',
	includeBaseClass: true,
});
</script>

<style lang="scss">
.ui-empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: var(--space-s);
	padding: var(--space-l) var(--space-m);
	color: color-mix(in srgb, var(--color-foreground), transparent 35%);
	text-align: center;

	border: 1px solid color-mix(in srgb, var(--color-primary), transparent 90%);
	border-radius: var(--border-radius);

	background-color: color-mix(in srgb, var(--color-primary), transparent 97%);

	&__icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: var(--font-size-xl);
	}

	&__message {
		margin: 0;
		font-size: var(--font-size-s);
	}
}
</style>
