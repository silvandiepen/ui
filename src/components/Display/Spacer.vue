<template>
	<div :class="blockClasses">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';
import { computed, PropType } from 'vue';

const props = defineProps({
	direction: {
		type: String as PropType<'row' | 'column' | 'horizontal' | 'vertical'>,
		default: 'row',
	},
	center: {
		type: Boolean,
		default: undefined,
	},
	align: {
		type: String as PropType<'start' | 'center' | 'end'>,
		default: undefined,
	},
	wrap: {
		type: Boolean,
		default: false,
	},
	spaceBetween: {
		type: Boolean,
		default: false,
	},
	stretch: {
		type: Boolean,
		default: false,
	},
});

const bemm = useBemm('spacer', {
	return: 'string',
	includeBaseClass: true,
});

const blockClasses = computed(() => {
	return bemm('', [
		props.direction ? props.direction : '',
		props.align ? props.align : '',
		props.center ? 'full-center' : '',
		props.wrap ? 'wrap' : '',
		props.stretch ? 'stretch' : '',
		props.spaceBetween ? 'space-between' : '',
	]);
});
</script>

<style lang="scss">
.spacer {
	$b: &;
	display: flex;
	gap: var(--spacer-gap, var(--space));

	&--row,
	&--horizontal {
		flex-direction: row;

		&#{$b}--start {
			align-items: flex-start;
		}
		&#{$b}--center {
			align-items: center;
		}
		&#{$b}--end {
			align-items: flex-end;
		}
	}
	&--column,
	&--vertical {
		flex-direction: column;

		&#{$b}--start {
			justify-content: flex-start;
		}
		&#{$b}--center {
			justify-content: center;
		}
		&#{$b}--end {
			justify-content: flex-end;
		}
	}
	&--wrap {
		flex-wrap: wrap;
	}

	&--space-between {
		justify-content: space-between;
		align-items: center;
	}
	&--stretch {
		justify-content: stretch;
		width: 100%;
	}

	&--full-center {
		align-items: center;
		justify-content: center;
	}
}
</style>
