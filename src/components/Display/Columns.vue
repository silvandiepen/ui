<template>
	<div :class="bemm('', [`${columns}`])" :style="styleVars">
		<slot />
	</div>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useBemm } from 'bemm';

const props = defineProps({
	columns: {
		type: [Number, String] as PropType<1 | 2 | 3 | 4 | 'auto'>,
		default: 2,
	},
	min: { type: Number, default: 0 },
	max: { type: Number, default: 0 },
	gap: {
		type: [String, Boolean] as PropType<string | boolean>,
		default: false,
	},
});

const bemm = useBemm('ui-columns', {
	return: 'string',
	includeBaseClass: true,
});

const styleVars = computed(() => ({
	...(props.min > 0 && { '--columns-min': `${props.min}px` }),
	...(props.max > 0 && { '--columns-max': props.max }),
}));
</script>

<style lang="scss">
.ui-columns {
	display: grid;
	gap: var(--space-m);

	&--1 {
		grid-template-columns: repeat(1, 1fr);
	}

	&--2 {
		grid-template-columns: repeat(2, 1fr);
	}

	&--3 {
		grid-template-columns: repeat(3, 1fr);
	}

	&--4 {
		grid-template-columns: repeat(4, 1fr);
	}

	&--auto {
		grid-template-columns: repeat(
			auto-fit,
			minmax(var(--columns-width, 320px), 1fr)
		);
	}
}
</style>
