<template>
	<div
		:class="tabsClasses"
		:data-test-id="testId"
	>
		<TabNavigation
			:class="[bemm('nav'), props.tabNavClasses, props.tabNavWrapperClasses]"
			:items="tabItems"
			:value="activeNavigationId"
			:vertical="props.vertical"
			:test-id="getTestId(props.testId, 'navigation')"
			@input="activateByNavigationId"
		/>

		<Card
			:variant="props.contentCardVariant"
			:color="props.color"
			:class="bemm('content-card')"
			:test-id="getTestId(props.testId, 'content-card')"
		>
			<div
				:class="[bemm('content'), props.tabContentClasses]"
				:data-test-id="getTestId(props.testId, 'content')"
			>
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
import { getTestId } from '../../utils/testId';

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
	testId: {
		type: String,
		default: undefined,
	},
});

const emit = defineEmits<TabsRootEmit>();

const bemm = useBemm('ui-tabs', {
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
	})
);
</script>

<style lang="scss">
.ui-tabs {
	$b: &;
	display: flex;
	flex-direction: column;
	gap: var(--space-s);

	&--vertical {
		flex-direction: row;
		align-items: flex-start;
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
