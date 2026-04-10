export interface BreadcrumbItem {
	name: string;
	label: string;
	to?: string | Record<string, unknown>;
	link?: string;
	action?: () => void;
}
