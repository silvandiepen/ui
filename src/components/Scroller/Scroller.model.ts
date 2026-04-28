import type { TestIdProps } from "../../types";

export interface ScrollerProps {
	testId?: TestIdProps['testId'];
	horizontal?: boolean;
	vertical?: boolean;
	gap?: string;
	height?: number | string;
}
