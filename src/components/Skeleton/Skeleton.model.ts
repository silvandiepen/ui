export type SkeletonShape = 'rect' | 'pill' | 'circle';

import type { TestIdProps } from "../../types";

export interface SkeletonProps {
	testId?: TestIdProps['testId'];
	width?: string | number;
	height?: string | number;
	shape?: SkeletonShape;
	animated?: boolean;
}
