<template>
	<div :class="bemm()">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';

const bemm = useBemm('chip-group', {
	return: 'string',
	includeBaseClass: true,
});
</script>

<style lang="scss">
.chip-group {
	display: flex;
	flex-wrap: wrap;
	gap: var(--space-xs);
}
</style>
