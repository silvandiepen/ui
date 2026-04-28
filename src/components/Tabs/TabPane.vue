<template>
	<div
		v-if="tab.active"
		:id="String(tab.id ?? tab.title ?? '')"
		:class="paneClasses"
		:data-test-id="testId"
	>
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useBemm } from 'bemm';
import type { TabPaneProps } from './Tabs.model';
import { useTabPane } from './useTabs';

defineOptions({
	name: 'ArTabPane',
});

const props = withDefaults(defineProps<TabPaneProps>(), {
	title: '',
	id: null,
	icon: '',
	testId: undefined,
});

const bemm = useBemm('ui-tabs', {
	return: 'string',
	includeBaseClass: false,
});

const { tab } = useTabPane(props);

const paneClasses = computed(() =>
	bemm('pane', {
		active: tab.active,
	})
);
</script>
