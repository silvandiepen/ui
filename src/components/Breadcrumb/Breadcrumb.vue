<template>
	<nav
		:class="b()"
		aria-label="Breadcrumb"
		role="navigation"
	>
		<ul v-if="items && items.length" :class="b('list')">
			<li
				v-for="(item, index) in items"
				:key="index"
				:class="b('item', [index === items.length - 1 ? 'active' : ''])"
				:aria-current="index === items.length - 1 ? 'page' : undefined"
			>
				<template v-if="item.to">
					<router-link :to="item.to" :class="b('link')">{{
						item.label
					}}</router-link>
				</template>
				<template v-else-if="item.link">
					<a :href="item.link" :class="b('link')">{{ item.label }}</a>
				</template>
				<template v-else-if="item.action">
					<button href="#" @click.prevent="item.action" :class="b('link')">
						{{ item.label }}
					</button>
				</template>
				<template v-else>
					<span :class="b('text')">{{ item.label }}</span>
				</template>
			</li>
		</ul>
		<ul v-else :class="b('list')">
			<slot />
		</ul>

		<Button
			:size="ButtonSize.SMALL"
			:variant="ButtonVariant.GHOST"
			:icon="Icons.CLIPBOARD"
			title="Copy current URL"
			@click="handleCopyBreadcrumb"
		/>
	</nav>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';
import { Icons } from 'open-icon';
import { Utils } from '@/common';
import type { BreadcrumbItem } from './Breadcrumb.model';
import {
	Button,
	ButtonSize,
	ButtonVariant,
} from '@/components/ui/Button';

const props = defineProps({
	items: {
		type: Array as () => BreadcrumbItem[],
		default: () => [],
	},
});

const b = useBemm('ar-breadcrumb', {
	return: 'string',
	includeBaseClass: true,
});

const handleCopyBreadcrumb = async () => {
	await Utils.copyStringToClipboard(window.location.href);
};
</script>

<style lang="scss">
.ar-breadcrumb {
	height: fit-content;
	display: flex;
	align-items: center;
	font-size: 1em;
	@media screen and (max-width: 600px) {
		font-size: 0.875em;
	}

	&__list {
		list-style: none;
		display: flex;
		padding: 0;
		margin: 0;
	}

	&__item {
		display: flex;
		align-items: center;
		gap: var(--space-s);
		padding: var(--space-xs);

		&:first-child {
			color: var(--color-primary);
		}

		&--active {
			font-weight: bold;
		}

		&::after {
			content: '/';
		}

		&:last-child::after {
			content: '';
		}
	}

	&__link {
		text-decoration: none;
		color: currentColor;

		&:hover {
			text-decoration: underline;
		}
	}

	&__item {
		&:first-child {
			color: var(--color-foreground);
			font-weight: var(--font-weight-medium);
		}

		&--active {
			font-weight: bold;
		}

		&::after {
			content: '/';
		}

		&:last-child::after {
			content: '';
		}
	}

	&__link {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}

	&__text {
		color: var(--color-foreground);
	}
}
</style>
