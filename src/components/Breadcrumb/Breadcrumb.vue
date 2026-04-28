<template>
	<nav
		:class="b()"
		aria-label="Breadcrumb"
		role="navigation"
		:data-test-id="testId"
	>
		<ul
			v-if="items && items.length"
			:class="b('list')"
			:data-test-id="getTestId(props.testId, 'list')"
		>
			<li
				v-for="(item, index) in items"
				:key="index"
				:class="b('item', [index === items.length - 1 ? 'active' : ''])"
				:aria-current="index === items.length - 1 ? 'page' : undefined"
				:data-test-id="getTestId(props.testId, `item-${index}`)"
			>
				<template v-if="item.to">
					<router-link
						:to="item.to"
						:class="b('link')"
						:data-test-id="getTestId(props.testId, `link-${index}`)"
					>{{
						item.label
					}}</router-link>
				</template>
				<template v-else-if="item.link">
					<a
						:href="item.link"
						:class="b('link')"
						:data-test-id="getTestId(props.testId, `link-${index}`)"
					>{{ item.label }}</a>
				</template>
				<template v-else-if="item.action">
					<button
						href="#"
						:class="b('link')"
						:data-test-id="getTestId(props.testId, `action-${index}`)"
						@click.prevent="item.action"
					>
						{{ item.label }}
					</button>
				</template>
				<template v-else>
					<span
						:class="b('text')"
						:data-test-id="getTestId(props.testId, `text-${index}`)"
					>{{ item.label }}</span>
				</template>
			</li>
		</ul>
		<ul
			v-else
			:class="b('list')"
			:data-test-id="getTestId(props.testId, 'list')"
		>
			<slot />
		</ul>

		<Button
			:size="ButtonSize.SMALL"
			:variant="ButtonVariant.GHOST"
			:icon="Icons.CLIPBOARD"
			title="Copy current URL"
			:test-id="getTestId(props.testId, 'copy')"
			@click="handleCopyBreadcrumb"
		/>
	</nav>
</template>

<script lang="ts" setup>
import { useBemm } from 'bemm';
import { Icons } from 'open-icon';
import { Utils } from '@/common';
import type { BreadcrumbItem } from './Breadcrumb.model';
import type { TestIdProps } from '../../types';
import { getTestId } from '../../utils/testId';
import {
	Button,
	ButtonSize,
	ButtonVariant,
} from '@/components/ui/Button';

const props = defineProps({
	testId: {
		type: String as () => TestIdProps['testId'],
		default: undefined,
	},
	items: {
		type: Array as () => BreadcrumbItem[],
		default: () => [],
	},
});

const b = useBemm('ui-breadcrumb', {
	return: 'string',
	includeBaseClass: true,
});

const handleCopyBreadcrumb = async () => {
	await Utils.copyStringToClipboard(window.location.href);
};
</script>

<style lang="scss">
@use '../../styles/mixins' as m;

.ui-breadcrumb {
	height: fit-content;
	display: flex;
	align-items: center;
	font-size: m.p('font-size', 1em);
	@media screen and (max-width: 600px) {
		font-size: m.p('font-size-mobile', 0.875em);
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
		gap: m.p('gap', var(--space-s));
		padding: m.p('padding', var(--space-xs));

		&--active {
			font-weight: bold;
		}

		&::after {
			content: m.p('separator', '/');
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
			color: m.p('first-child-color', var(--color-foreground));
			font-weight: m.p('first-child-font-weight', var(--font-weight-medium));
		}

		&--active {
			font-weight: bold;
		}

		&::after {
			content: m.p('separator', '/');
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
