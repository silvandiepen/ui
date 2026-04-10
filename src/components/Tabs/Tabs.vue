<template>
	<div :class="tabsClasses">
		<TabNavigation
			:class="[bemm('nav'), props.tabNavClasses, props.tabNavWrapperClasses]"
			:items="tabItems"
			:value="activeNavigationId"
			:vertical="props.vertical"
			:centered="props.centered"
			@input="activateByNavigationId"
		/>

		<Card
			:variant="props.contentCardVariant"
			:color="props.color"
			:class="bemm('content-card')"
		>
			<div :class="[bemm('content'), props.tabContentClasses]">
				<slot></slot>
			</div>
		</Card>
	</div>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useBemm } from 'bemm';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/types';
import type { TabsClassValue, TabsRootEmit } from './Tabs.model';
import type { ButtonVariant } from '@/components/ui/Button';
import type { CardProps } from '@/components/ui/Card/Card.model';
import TabNavigation from './TabNavigation.vue';
import { useTabsRoot } from './useTabs';

defineOptions({
	name: 'ArTabs',
});

const props = defineProps({
	type: {
		type: String,
		default: '',
	},
	activeTab: {
		type: String,
		default: '',
	},
	value: {
		type: String,
		default: '',
	},
	tabNavWrapperClasses: {
		type: [String, Object] as PropType<TabsClassValue>,
		default: '',
	},
	tabNavClasses: {
		type: [String, Object] as PropType<TabsClassValue>,
		default: '',
	},
	tabContentClasses: {
		type: [String, Object] as PropType<TabsClassValue>,
		default: '',
	},
	vertical: {
		type: Boolean,
		default: false,
	},
	centered: {
		type: Boolean,
		default: false,
	},
	activeVariant: {
		type: String as PropType<ButtonVariant>,
		default: 'default',
	},
	inactiveVariant: {
		type: String as PropType<ButtonVariant>,
		default: 'ghost',
	},
	color: {
		type: String as PropType<Colors>,
		default: Colors.SECONDARY,
	},
	contentCardVariant: {
		type: String as PropType<CardProps['variant']>,
		default: 'default',
	},
});

const emit = defineEmits<TabsRootEmit>();

const bemm = useBemm('ar-tabs', {
	return: 'string',
	includeBaseClass: true,
});

const { tabItems, activeNavigationId, activateByNavigationId } = useTabsRoot(
	props,
	emit
);

const tabsClasses = computed(() =>
	bemm('', {
		vertical: props.vertical,
		centered: props.centered,
	})
);
</script>

<style lang="scss">
.ar-tabs {
	$b: &;
	display: flex;
	flex-direction: column;
	gap: var(--space-s);

	&--vertical {
		flex-direction: row;
		align-items: flex-start;
	}

	&--centered {
		#{$b}__nav {
			justify-content: center;
		}
	}

	&__nav {
		width: fit-content;
	}

	&--vertical &__nav {
		width: auto;
	}

	&__content-card {
	}

	&__content {
		width: 100%;
	}
}
</style>
