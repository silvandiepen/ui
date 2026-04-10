export type SkeletonShape = 'rect' | 'pill' | 'circle';

export interface SkeletonProps {
	width?: string | number;
	height?: string | number;
	shape?: SkeletonShape;
	animated?: boolean;
}
