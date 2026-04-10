import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
	Ref,
} from 'vue';
import type {
	DataListColumn,
	DataListColumnWidth,
	DataListRow,
} from './DataList.model';
import { buildGridTemplate, capMeasuredWidth } from './DataList.layout';

type LayoutProps = {
	autoWidth: boolean;
	autoWidthSample: number;
	autoWidthMax: number;
	data: DataListRow[];
};

type UseDataListLayoutOptions = {
	initialColumnWidths?: DataListColumnWidth[] | null;
	externalColumnWidths?: Ref<DataListColumnWidth[] | null>;
};

/**
 * Normalizes column widths by removing invalid/duplicate entries.
 */
const normalizeColumnWidths = (
	columnWidths: DataListColumnWidth[] = []
): DataListColumnWidth[] => {
	const seen = new Set<string>();
	const normalized: DataListColumnWidth[] = [];

	columnWidths.forEach((entry) => {
		if (!entry?.key || seen.has(entry.key)) {
			return;
		}

		const width = Number(entry.width);
		if (!Number.isFinite(width) || width <= 0) {
			return;
		}

		seen.add(entry.key);
		normalized.push({
			key: entry.key,
			width: Math.round(width),
		});
	});

	return normalized;
};

/**
 * Converts a normalized width list to a key-value lookup map.
 */
const toWidthMap = (
	columnWidths: DataListColumnWidth[] = []
): Record<string, number> =>
	normalizeColumnWidths(columnWidths).reduce<Record<string, number>>(
		(acc, entry) => {
			acc[entry.key] = entry.width;
			return acc;
		},
		{}
	);

/**
 * Handles DataList layout responsibilities:
 * - CSS grid template generation
 * - auto-width measurement
 * - manual column resize lifecycle
 * - syncing controlled/uncontrolled column widths
 */
export const useDataListLayout = (
	props: LayoutProps,
	rootRef: Ref<HTMLElement | null>,
	allColumns: Ref<DataListColumn[]>,
	visibleColumns: Ref<DataListColumn[]>,
	selectable: Ref<boolean>,
	hasRowActions: Ref<boolean>,
	hasColumnMenu: Ref<boolean>,
	options: UseDataListLayoutOptions = {}
) => {
	const autoWidths = ref<Record<string, number>>({});
	const resizedWidths = ref<Record<string, number>>(
		toWidthMap(options.initialColumnWidths || [])
	);
	const isResizingColumn = ref(false);
	let measureFrame: number | null = null;
	let activeResize: {
		columnKey: string;
		startX: number;
		startWidth: number;
		minWidth: number;
		maxWidth: number;
	} | null = null;

	const gridStyles = computed(() => {
		const template = buildGridTemplate(visibleColumns.value, {
			selectable: selectable.value,
			hasRowActions: hasRowActions.value,
			hasColumnMenu: hasColumnMenu.value,
			autoWidth: props.autoWidth,
			autoWidthMax: props.autoWidthMax,
			autoWidths: autoWidths.value,
			resizedWidths: resizedWidths.value,
		});
		return { '--data-list-columns': template };
	});

	const columnWidths = computed<DataListColumnWidth[]>(() =>
		Object.entries(resizedWidths.value)
			.map(([key, width]) => ({
				key,
				width: Math.round(width),
			}))
			.filter(
				(entry) =>
					Boolean(entry.key) && Number.isFinite(entry.width) && entry.width > 0
			)
	);

	/**
	 * Resolves the resize bounds for a column.
	 */
	const resolveColumnBounds = (column: DataListColumn) => {
		const minWidth = Math.max(56, column.minWidth ?? 120);
		const maxWidth = Math.max(minWidth, column.maxWidth ?? 1200);
		return { minWidth, maxWidth };
	};

	/**
	 * Clamps a width value inside min/max bounds.
	 */
	const clampWidth = (
		nextWidth: number,
		minWidth: number,
		maxWidth: number
	): number => Math.min(maxWidth, Math.max(minWidth, nextWidth));

	/**
	 * Resolves the starting width used when a column resize begins.
	 */
	const resolveStartWidth = (
		columnKey: string,
		column: DataListColumn
	): number => {
		const resized = resizedWidths.value[columnKey];
		if (Number.isFinite(resized) && resized > 0) {
			return resized;
		}

		const headerCell = rootRef.value?.querySelector<HTMLElement>(
			`.ar-data-list__header [data-col-key="${columnKey}"]`
		);
		const domWidth = headerCell?.getBoundingClientRect().width || 0;
		if (Number.isFinite(domWidth) && domWidth > 0) {
			return Math.ceil(domWidth);
		}

		const measured = autoWidths.value[columnKey];
		if (Number.isFinite(measured) && measured > 0) {
			return measured;
		}

		if (typeof column.width === 'number') {
			return column.width;
		}

		return column.minWidth ?? 120;
	};

	/**
	 * Ends the active resize interaction and removes global listeners.
	 */
	const stopColumnResize = () => {
		isResizingColumn.value = false;
		activeResize = null;
		window.removeEventListener('mousemove', onResizeMove);
		window.removeEventListener('mouseup', stopColumnResize);
	};

	/**
	 * Handles width updates while dragging a column resize handle.
	 */
	const onResizeMove = (event: MouseEvent) => {
		if (!activeResize) {
			return;
		}

		const delta = event.clientX - activeResize.startX;
		const nextWidth = clampWidth(
			Math.round(activeResize.startWidth + delta),
			activeResize.minWidth,
			activeResize.maxWidth
		);

		resizedWidths.value = {
			...resizedWidths.value,
			[activeResize.columnKey]: nextWidth,
		};
	};

	/**
	 * Starts a resize interaction for a column.
	 */
	const startColumnResize = (column: DataListColumn, event: MouseEvent) => {
		if (!rootRef.value || event.button !== 0) {
			return;
		}

		const { minWidth, maxWidth } = resolveColumnBounds(column);
		const startWidth = resolveStartWidth(column.key, column);
		activeResize = {
			columnKey: column.key,
			startX: event.clientX,
			startWidth,
			minWidth,
			maxWidth,
		};
		isResizingColumn.value = true;
		window.addEventListener('mousemove', onResizeMove);
		window.addEventListener('mouseup', stopColumnResize);
	};

	/**
	 * Clears user-resized widths, restoring computed/default widths.
	 */
	const resetColumnWidths = () => {
		resizedWidths.value = {};
	};

	/**
	 * Measures visible column content and computes auto widths.
	 */
	const measureAutoWidths = () => {
		if (!props.autoWidth || !rootRef.value) {
			return;
		}

		const sampleLimit = Math.max(1, props.autoWidthSample || 15);
		const next: Record<string, number> = {};
		const headerRow = rootRef.value.querySelector('.ar-data-list__header');
		const bodyRows = Array.from(
			rootRef.value.querySelectorAll('.ar-data-list__row')
		).slice(0, sampleLimit);

		visibleColumns.value.forEach((column) => {
			const hasFixedWidth =
				column.width !== undefined &&
				column.width !== null &&
				String(column.width).trim().length > 0;
			if (hasFixedWidth) {
				if (typeof column.width === 'number') {
					next[column.key] = column.width;
				}
				return;
			}

			let maxWidth = column.minWidth ?? 120;
			const headerCell = headerRow?.querySelector<HTMLElement>(
				`[data-col-key="${column.key}"]`
			);
			if (headerCell) {
				maxWidth = Math.max(maxWidth, Math.ceil(headerCell.scrollWidth));
			}

			bodyRows.forEach((rowEl) => {
				const cell = rowEl.querySelector<HTMLElement>(
					`[data-col-key="${column.key}"]`
				);
				if (cell) {
					maxWidth = Math.max(maxWidth, Math.ceil(cell.scrollWidth));
				}
			});

			next[column.key] = capMeasuredWidth(
				maxWidth + 16,
				column,
				props.autoWidthMax || 200
			);
		});

		autoWidths.value = next;
	};

	/**
	 * Schedules a single animation-frame re-measure pass.
	 */
	const scheduleMeasure = () => {
		if (!props.autoWidth) {
			return;
		}
		if (measureFrame) {
			cancelAnimationFrame(measureFrame);
		}
		nextTick(() => {
			measureFrame = requestAnimationFrame(measureAutoWidths);
		});
	};

	onMounted(() => {
		if (props.autoWidth) {
			window.addEventListener('resize', scheduleMeasure);
			scheduleMeasure();
		}
	});

	onBeforeUnmount(() => {
		window.removeEventListener('resize', scheduleMeasure);
		if (measureFrame) {
			cancelAnimationFrame(measureFrame);
		}
		stopColumnResize();
	});

	watch(
		() => props.autoWidth,
		(enabled) => {
			if (enabled) {
				window.addEventListener('resize', scheduleMeasure);
				scheduleMeasure();
			} else {
				window.removeEventListener('resize', scheduleMeasure);
				autoWidths.value = {};
			}
		}
	);

	watch(visibleColumns, scheduleMeasure);
	watch(allColumns, (columns) => {
		const availableKeys = new Set(columns.map((column) => column.key));
		const nextResized = Object.entries(resizedWidths.value).reduce<
			Record<string, number>
		>((acc, [key, width]) => {
			if (availableKeys.has(key)) {
				acc[key] = width;
			}
			return acc;
		}, {});

		resizedWidths.value = nextResized;
	});

	watch(
		() => options.externalColumnWidths?.value,
		(externalColumnWidths) => {
			if (!Array.isArray(externalColumnWidths)) {
				return;
			}

			resizedWidths.value = toWidthMap(externalColumnWidths);
		},
		{ deep: true, immediate: true }
	);
	watch(
		() => props.data,
		() => scheduleMeasure(),
		{ deep: true }
	);

	return {
		gridStyles,
		scheduleMeasure,
		startColumnResize,
		resetColumnWidths,
		isResizingColumn,
		columnWidths,
	};
};
