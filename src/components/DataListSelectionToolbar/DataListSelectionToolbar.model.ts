import type { DropdownItem } from '@/components/ui/Dropdown/Dropdown.model';
import type { DataListRow } from '@/components/ui/DataList/DataList.model';
import type { TestIdProps } from '@/types';

export interface DataListSelectionToolbarProps {
	testId?: TestIdProps['testId'];
	selectedCount: number;
	selectedRows: DataListRow[];
	selectionActions?: DropdownItem[];
	showActions?: boolean;
	disableSelectAllPage?: boolean;
	panelOpen?: boolean;
	previewLimit?: number;
	resolveLabel?: (row: DataListRow, index: number) => string;
	onSelectAllPage?: () => void;
	onDeselectAll?: () => void;
	onDeselectRow?: (row: DataListRow) => void;
	onActionSelect?: (item: DropdownItem) => void;
	onPanelOpenChange?: (isOpen: boolean) => void;
}
