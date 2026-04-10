<template>
	<nav :class="bemm('')" aria-label="Pagination">
		<div v-if="showSizeSelector" :class="bemm('sizes')">
			<label :class="bemm('label')" for="pagination-size-select">
				Items per page
			</label>
			<select
				id="pagination-size-select"
				:class="bemm('select')"
				:value="String(internalPageSize)"
				@change="onPageSizeChange"
			>
				<option
					v-for="size in pageSizes"
					:key="size"
					:value="String(size)"
				>
					{{ size }}
				</option>
			</select>
		</div>

		<div :class="bemm('controls')">
			<Button
				v-if="showPrev"
				variant="ghost"
				:disabled="isFirstPage"
				@click="goPrev"
				:icon="Icons.CHEVRON_LEFT"
			/>

			<div v-if="showPager" :class="bemm('pager')">
				<template v-for="(item, index) in visibleItems" :key="`${item}-${index}`">
					<button
						v-if="isPageNumber(item)"
						type="button"
						:class="
							bemm('button', [
								'page',
								item === internalCurrentPage ? 'active' : '',
							])
						"
						@click="setPage(item)"
					>
						{{ item }}
					</button>
					<span v-else :class="bemm('ellipsis')">...</span>
				</template>
			</div>

			<Button
				v-if="showNext"
				variant="ghost"
				:disabled="isLastPage"
				:icon="Icons.CHEVRON_RIGHT"
				@click="goNext"
			/>
		</div>

		<div v-if="showJumper" :class="bemm('jumper')">
			<label :class="bemm('label')" for="pagination-jumper">
				Go to page
			</label>
			<input
				id="pagination-jumper"
				:class="bemm('input')"
				type="number"
				min="1"
				:max="pageCount"
				:value="jumperValue"
				@input="onJumperInput"
				@blur="applyJumper"
				@keyup.enter="applyJumper"
			/>
		</div>
	</nav>
</template>

<script lang="ts" setup>
import { computed, ref, toRefs, watch } from 'vue';
import { useBemm } from 'bemm';
import {
	DEFAULT_TABLE_PAGE_SIZE,
	DEFAULT_TABLE_PAGE_SIZES,
} from '@/constants/pagination';
import { buildVisiblePages, parsePaginationLayout } from './Pagination.utils';
import { Icons } from '@/types';
import { Button } from '@/components/ui/Button';
import type {
	PaginationEmit,
	PaginationItem,
	PaginationProps,
} from './Pagination.model';

defineOptions({
	name: 'ArPagination',
});

const props = withDefaults(defineProps<PaginationProps>(), {
	currentPage: undefined,
	value: undefined,
	pageSize: undefined,
	perPage: undefined,
	total: 0,
	pageSizes: () => [...DEFAULT_TABLE_PAGE_SIZES],
	layout: 'sizes, prev, pager, next, jumper',
	showNumbers: true,
	siblingCount: 1,
	boundaryCount: 1,
});
const { pageSizes } = toRefs(props);

const emit = defineEmits<PaginationEmit>();

const bemm = useBemm('ar-pagination', {
	return: 'string',
	includeBaseClass: true,
});

const initialPage = props.currentPage || props.value || 1;
const initialPageSize =
	props.pageSize || props.perPage || DEFAULT_TABLE_PAGE_SIZE;

const internalCurrentPage = ref(Math.max(1, Number(initialPage) || 1));
const internalPageSize = ref(
	Math.max(1, Number(initialPageSize) || DEFAULT_TABLE_PAGE_SIZE)
);
const jumperValue = ref(String(internalCurrentPage.value));

const layoutTokens = computed(() => parsePaginationLayout(props.layout));
const hasToken = (token: string) => layoutTokens.value.includes(token);

const pageCount = computed(() => {
	const total = Math.max(0, Number(props.total) || 0);
	const size = Math.max(
		1,
		Number(internalPageSize.value) || DEFAULT_TABLE_PAGE_SIZE
	);
	return Math.max(1, Math.ceil(total / size));
});

const clampPage = (page: number) =>
	Math.min(pageCount.value, Math.max(1, page));

const isFirstPage = computed(() => internalCurrentPage.value <= 1);
const isLastPage = computed(() => internalCurrentPage.value >= pageCount.value);

const visibleItems = computed<PaginationItem[]>(() =>
	buildVisiblePages(
		pageCount.value,
		internalCurrentPage.value,
		props.siblingCount,
		props.boundaryCount
	)
);

const showSizeSelector = computed(() => hasToken('sizes'));
const showPager = computed(() => hasToken('pager') && props.showNumbers);
const showPrev = computed(() => hasToken('prev'));
const showNext = computed(() => hasToken('next'));
const showJumper = computed(() => hasToken('jumper'));

const syncCurrentPage = (page: number | string | undefined) => {
	const parsed = Number(page);
	if (Number.isNaN(parsed) || parsed <= 0) {
		return;
	}
	internalCurrentPage.value = clampPage(parsed);
	jumperValue.value = String(internalCurrentPage.value);
};

const syncPageSize = (size: number | string | undefined) => {
	const parsed = Number(size);
	if (Number.isNaN(parsed) || parsed <= 0) {
		return;
	}
	internalPageSize.value = parsed;
};

const emitPageChange = (page: number) => {
	const nextPage = clampPage(page);
	if (nextPage === internalCurrentPage.value) {
		jumperValue.value = String(nextPage);
		return;
	}
	internalCurrentPage.value = nextPage;
	jumperValue.value = String(nextPage);
	emit('input', nextPage);
	emit('update:currentPage', nextPage);
	emit('current-change', nextPage);
};

const setPage = (page: number) => emitPageChange(page);
const goPrev = () =>
	!isFirstPage.value && emitPageChange(internalCurrentPage.value - 1);
const goNext = () =>
	!isLastPage.value && emitPageChange(internalCurrentPage.value + 1);

const onPageSizeChange = (event: Event) => {
	const target = event.target as HTMLSelectElement | null;
	const nextSize = Math.max(
		1,
		Number(target?.value) || DEFAULT_TABLE_PAGE_SIZE
	);

	internalPageSize.value = nextSize;
	emit('update:pageSize', nextSize);
	emit('update:perPage', nextSize);
	emit('size-change', nextSize);

	const nextPage = clampPage(internalCurrentPage.value);
	if (nextPage !== internalCurrentPage.value) {
		emitPageChange(nextPage);
	}
};

const onJumperInput = (event: Event) => {
	const target = event.target as HTMLInputElement | null;
	jumperValue.value = target?.value ?? '';
};

const applyJumper = () => {
	const parsed = Number(jumperValue.value);
	if (Number.isNaN(parsed)) {
		jumperValue.value = String(internalCurrentPage.value);
		return;
	}

	emitPageChange(parsed);
};

const isPageNumber = (item: PaginationItem): item is number =>
	typeof item === 'number';

watch(
	() => props.currentPage,
	(value) => syncCurrentPage(value)
);

watch(
	() => props.value,
	(value) => syncCurrentPage(value)
);

watch(
	() => props.pageSize,
	(value) => syncPageSize(value)
);

watch(
	() => props.perPage,
	(value) => syncPageSize(value)
);

watch(pageCount, () => {
	internalCurrentPage.value = clampPage(internalCurrentPage.value);
	jumperValue.value = String(internalCurrentPage.value);
});
</script>

<style lang="scss">
.ar-pagination {
	display: flex;
	align-items: center;
	gap: var(--space);
	flex-wrap: wrap;

	&__sizes,
	&__jumper {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
	}

	&__label {
		font-size: var(--font-size-s);
		color: var(--color-foreground);
	}

	&__select,
	&__input {
		min-height: 2.25rem;
		padding: 0 var(--space-s);
		border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
		border-radius: var(--border-radius);
		background: var(--color-background);
		color: var(--color-foreground);
	}

	&__controls,
	&__pager {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
	}

	&__button {
		min-width: 2.25rem;
		min-height: 2.25rem;
		padding: 0 var(--space-s);
		border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 82%);
		border-radius: var(--border-radius);
		background: var(--color-background);
		color: var(--color-foreground);
		cursor: pointer;

		&--active {
			border-color: var(--color-primary);
			background: color-mix(in srgb, var(--color-primary), transparent 88%);
			color: var(--color-primary);
		}
	}

	&__ellipsis {
		padding: 0 var(--space-xs);
	}
}
</style>
