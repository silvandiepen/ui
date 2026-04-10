# Toolbar

Global fixed toolbar shell rendered once in `App.vue`.

## Usage

```ts
import { toolbarService } from '@/components/ui/Toolbar';
import MyToolbarContent from './MyToolbarContent.vue';

const id = toolbarService.show({
	id: 'my-toolbar',
	component: MyToolbarContent,
	props: { count: 3 },
});

toolbarService.update(id, { props: { count: 4 } });
toolbarService.hide(id);
```

## Notes

- The toolbar shell is agnostic; consumers provide the content component.
- A single toolbar is active at a time (new `show` replaces the previous one).
