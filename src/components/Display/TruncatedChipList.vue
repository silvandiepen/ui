<template>
	<div :class="bemm()">
		<Chip
			v-for="(item, index) in visibleItems"
			:key="`${String(item)}-${index}`"
			:size="size"
			:color="chipColor"
		>
			{{ item }}
		</Chip>
		<span v-if="normalizedItems.length === 0">{{ empty }}</span>
		<Tooltip
			v-if="hiddenCount > 0"
			placement="top"
			:content="`${hiddenCount} more`"
		>
			<template #content>
				<slot name="tooltip-content">
					<div :class="bemm('tooltip')">{{ tooltipText }}</div>
				</slot>
			</template>
			<span :class="bemm('more')">...and {{ hiddenCount }} more</span>
		</Tooltip>
	</div>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { useBemm } from 'bemm';
import { Chip } from '@/components/ui/Display';
import { TooltipWrapper as Tooltip } from '@/components/ui/Tooltip';
import { Color, Size } from '@/types';

const props = defineProps({
	items: {
		type: Array as PropType<Array<string | number>>,
		default: () => [],
	},
	maxVisible: {
		type: Number,
		default: 3,
	},
	size: {
		type: String as PropType<Size>,
		default: Size.SMALL,
	},
	chipColor: {
		type: String as PropType<Color>,
		default: Color.PRIMARY,
	},
	overflowChipColor: {
		type: String as PropType<Color>,
		default: Color.DARK,
	},
	empty: {
		type: String,
		default: '-',
	},
});

const bemm = useBemm('truncated-chip-list', {
	return: 'string',
	includeBaseClass: true,
});

const normalizedItems = computed(() =>
	(props.items || [])
		.map((item) => String(item))
		.filter((item) => item.length > 0)
);

const visibleItems = computed(() =>
	normalizedItems.value.slice(0, Math.max(0, props.maxVisible))
);

const hiddenCount = computed(() =>
	Math.max(0, normalizedItems.value.length - visibleItems.value.length)
);

const tooltipText = computed(() => normalizedItems.value.join(', '));
</script>

<style lang="scss">
.truncated-chip-list {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: var(--space-xs);

	&__tooltip {
		max-width: 420px;
		min-width: 240px;
		width: fit-content;
		white-space: normal;
	}

	&__more {
		font-size: var(--font-size-s);
		color: var(--color-text-secondary);
	}
}
</style>
