<template>
	<div :class="bemm()">
		<span :class="bemm('pre')" v-if="pre">{{ pre }}</span>
		<span :class="bemm('id')">{{ id }}</span>
		<Icon
			:name="Icons.CLIPBOARD"
			:class="bemm('copy-icon')"
			@click.native.stop="handleCopyId"
			title="Copy ID"
		/>
	</div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import Utils from '@/common/Utils';
import { useBemm } from 'bemm';
import { Icon, Icons } from '../Icon';

const props = defineProps({
	id: {
		type: String as PropType<string>,
		required: false,
		default: '',
	},
	pre: {
		type: String as PropType<string>,
		default: '',
	},
});

const emit = defineEmits(['copied']);

const handleCopyId = async () => {
	await Utils.copyStringToClipboard(props.id);
	emit('copied', props.id);
};

const bemm = useBemm('id-view', {
	return: 'string',
	includeBaseClass: true,
});
</script>

<style lang="scss">
.id-view {
	--id-view-background: color-mix(
		in srgb,
		var(--color-secondary),
		var(--color-background) 95%
	);
	--id-view-border: color-mix(
		in srgb,
		var(--color-secondary),
		var(--color-background) 80%
	);

	--id-view-color: color-mix(
		in srgb,
		var(--color-secondary),
		var(--color-foreground) 50%
	);

	background-color: var(--id-view-background);
	border: 1px solid var(--id-view-border);
	color: var(--id-view-color);
	font-weight: 600;
	border-radius: var(--border-radius);
	width: fit-content;
	padding: var(--space-s);
	display: flex;
	gap: var(--space-s);
	align-items: center;
	max-width: 100%;

	&__pre {
		font-weight: 600;
		margin-right: 8px;
	}

	&__id {
		font-family: 'Courier New', Courier, monospace;
		font-size: var(--font-size-s);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	&__copy-icon {
		color: var(--color-secondary);
		cursor: pointer;

		&:hover {
			color: black;
		}
	}
}
</style>
