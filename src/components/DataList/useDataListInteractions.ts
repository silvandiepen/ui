import { onBeforeUnmount, onMounted } from 'vue';
import type { DataListRow } from './DataList.model';
import type { Ref } from 'vue';

type InteractionProps = {
	rowClickable: Ref<boolean>;
};

type EmitFn = (...args: any[]) => void;

/**
 * Detects whether the event target is an interactive child that should
 * prevent row click navigation/selection behavior.
 */
export const isInteractiveTarget = (target: EventTarget | null) => {
	if (!(target instanceof HTMLElement)) return false;
	return Boolean(
		target.closest(
			'button, a, input, select, textarea, [role="button"], [data-row-click-stop]'
		)
	);
};

/**
 * Handles DataList row-level interactions that are orthogonal to table state:
 * row-click guarding and global context-menu close behavior.
 */
export const useDataListInteractions = (
	props: InteractionProps,
	emit: EmitFn,
	closeContextMenu: () => void
) => {
	/**
	 * Emits `row-click` only when row clicks are enabled and the click did
	 * not originate from an interactive inner control.
	 */
	const onRowClick = (event: MouseEvent, row: DataListRow) => {
		if (!props.rowClickable.value) return;
		if (isInteractiveTarget(event.target)) return;
		emit('row-click', row);
	};

	onMounted(() => {
		document.addEventListener('click', closeContextMenu);
	});

	onBeforeUnmount(() => {
		document.removeEventListener('click', closeContextMenu);
	});

	return {
		onRowClick,
	};
};
