<template>
  <div :class="bemm()" :data-test-id="testId">
    <label v-if="label" :class="bemm('label')" :data-test-id="getTestId(testId, 'label')">
      {{ label }}
      <span v-if="required" :class="bemm('required')" :data-test-id="getTestId(testId, 'required')">*</span>
    </label>

    <div :class="bemm('container', { error: !!error, disabled, readonly, focused: isFocused })" :data-test-id="getTestId(testId, 'container')">
      <!-- Toolbar -->
      <div v-if="editor && activeFeatures.length" :class="bemm('toolbar')" :data-test-id="getTestId(testId, 'toolbar')">
        <template v-for="group in toolbarGroups" :key="group.id">
          <div :class="bemm('toolbar-group')" :data-test-id="getTestId(testId, `toolbar-group-${group.id}`)">
            <button
              v-for="btn in group.buttons"
              :key="btn.id"
              type="button"
              :class="bemm('toolbar-btn', { active: btn.active?.(), disabled: btn.disabled?.() })"
              :title="btn.title"
              :disabled="btn.disabled?.()"
              :data-test-id="getTestId(testId, `toolbar-button-${btn.id}`)"
              @mousedown.prevent="btn.action()"
            >
              <Icon v-if="btn.icon" :name="btn.icon" :class="bemm('toolbar-icon')" :data-test-id="getTestId(testId, `toolbar-button-${btn.id}-icon`)" />
              <span v-else-if="btn.label" :class="bemm('toolbar-label')" :data-test-id="getTestId(testId, `toolbar-button-${btn.id}-label`)">{{ btn.label }}</span>
            </button>
          </div>
          <div v-if="group.id !== toolbarGroups[toolbarGroups.length - 1].id" :class="bemm('toolbar-divider')" :data-test-id="getTestId(testId, `toolbar-divider-${group.id}`)" />
        </template>
      </div>

      <!-- Editor -->
      <EditorContent
        :editor="editor"
        :class="bemm('editor')"
        :style="{ minHeight: height, maxHeight: maxHeight }"
        :data-test-id="getTestId(testId, 'control')"
      />
    </div>

    <span v-if="error" :class="bemm('error')" :data-test-id="getTestId(testId, 'error')">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useBemm } from 'bemm'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import Icon from '../../Icon/Icon.vue'
import type { RichTextEditorProps, RichTextFeature } from './RichTextEditor.model'
import { DEFAULT_FEATURES } from './RichTextEditor.model'
import { getTestId } from '../../../utils'

const lowlight = createLowlight(common)

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  modelValue: '',
  height: '160px',
  maxHeight: '480px',
  features: () => DEFAULT_FEATURES,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
}>()

const bemm = useBemm('rich-text-editor')
const isFocused = ref(false)
const settingContent = ref(false)

const activeFeatures = computed<RichTextFeature[]>(() =>
  props.features.length ? props.features : DEFAULT_FEATURES
)

const has = (f: RichTextFeature) => activeFeatures.value.includes(f)

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled && !props.readonly,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    Placeholder.configure({ placeholder: props.placeholder ?? 'Start typing…' }),
    CodeBlockLowlight.configure({ lowlight }),
  ],
  onUpdate({ editor }) {
    if (settingContent.value) return
    emit('update:modelValue', editor.getHTML())
  },
  onFocus() {
    isFocused.value = true
    emit('focus')
  },
  onBlur() {
    isFocused.value = false
    emit('blur')
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    settingContent.value = true
    editor.value.commands.setContent(val ?? '')
    settingContent.value = false
  }
})

watch(() => props.disabled, (val) => {
  editor.value?.setEditable(!val && !props.readonly)
})

watch(() => props.readonly, (val) => {
  editor.value?.setEditable(!val && !props.disabled)
})

onBeforeUnmount(() => editor.value?.destroy())

// --- Toolbar ---

interface ToolbarButton {
  id: string
  icon?: string
  label?: string
  title: string
  action: () => void
  active?: () => boolean
  disabled?: () => boolean
}

interface ToolbarGroup {
  id: string
  buttons: ToolbarButton[]
}

const toolbarGroups = computed<ToolbarGroup[]>(() => {
  const e = editor.value
  if (!e) return []

  const groups: ToolbarGroup[] = []

  // Headings — no heading icons in the library, use text labels
  const headingBtns: ToolbarButton[] = []
  if (has('heading')) {
    headingBtns.push(
      { id: 'h1', label: 'H1', title: 'Heading 1', action: () => e.chain().focus().toggleHeading({ level: 1 }).run(), active: () => e.isActive('heading', { level: 1 }) },
      { id: 'h2', label: 'H2', title: 'Heading 2', action: () => e.chain().focus().toggleHeading({ level: 2 }).run(), active: () => e.isActive('heading', { level: 2 }) },
      { id: 'h3', label: 'H3', title: 'Heading 3', action: () => e.chain().focus().toggleHeading({ level: 3 }).run(), active: () => e.isActive('heading', { level: 3 }) },
    )
  }
  if (headingBtns.length) groups.push({ id: 'headings', buttons: headingBtns })

  // Inline marks
  const markBtns: ToolbarButton[] = []
  if (has('bold'))      markBtns.push({ id: 'bold',      icon: 'text-bold',         title: 'Bold',      action: () => e.chain().focus().toggleBold().run(),      active: () => e.isActive('bold') })
  if (has('italic'))    markBtns.push({ id: 'italic',    icon: 'text-italic',       title: 'Italic',    action: () => e.chain().focus().toggleItalic().run(),    active: () => e.isActive('italic') })
  if (has('underline')) markBtns.push({ id: 'underline', icon: 'text-underline',    title: 'Underline', action: () => e.chain().focus().toggleUnderline().run(), active: () => e.isActive('underline') })
  if (has('strike'))    markBtns.push({ id: 'strike',    icon: 'text-line-through', title: 'Strike',    action: () => e.chain().focus().toggleStrike().run(),    active: () => e.isActive('strike') })
  if (has('code'))      markBtns.push({ id: 'code',      icon: 'code-brackets',     title: 'Code',      action: () => e.chain().focus().toggleCode().run(),      active: () => e.isActive('code') })
  if (markBtns.length) groups.push({ id: 'marks', buttons: markBtns })

  // Lists + block
  const blockBtns: ToolbarButton[] = []
  if (has('bulletList'))     blockBtns.push({ id: 'ul',         icon: 'text-detail-list', title: 'Bullet list',  action: () => e.chain().focus().toggleBulletList().run(),  active: () => e.isActive('bulletList') })
  if (has('orderedList'))    blockBtns.push({ id: 'ol',         label: '1.',              title: 'Ordered list', action: () => e.chain().focus().toggleOrderedList().run(), active: () => e.isActive('orderedList') })
  if (has('blockquote'))     blockBtns.push({ id: 'blockquote', icon: 'speech-balloon',   title: 'Blockquote',   action: () => e.chain().focus().toggleBlockquote().run(),  active: () => e.isActive('blockquote') })
  if (has('codeBlock'))      blockBtns.push({ id: 'codeBlock',  icon: 'terminal',         title: 'Code block',   action: () => e.chain().focus().toggleCodeBlock().run(),   active: () => e.isActive('codeBlock') })
  if (has('horizontalRule')) blockBtns.push({ id: 'hr',         icon: 'minus',            title: 'Divider',      action: () => e.chain().focus().setHorizontalRule().run() })
  if (blockBtns.length) groups.push({ id: 'blocks', buttons: blockBtns })

  // Link
  if (has('link')) {
    groups.push({
      id: 'link',
      buttons: [{
        id: 'link',
        icon: 'link',
        title: 'Link',
        action: () => {
          if (e.isActive('link')) {
            e.chain().focus().unsetLink().run()
          } else {
            const url = window.prompt('URL')
            if (url) e.chain().focus().setLink({ href: url }).run()
          }
        },
        active: () => e.isActive('link'),
      }],
    })
  }

  // History
  const historyBtns: ToolbarButton[] = []
  if (has('undo')) historyBtns.push({ id: 'undo', icon: 'arrow-rotate-bottom-left', title: 'Undo', action: () => e.chain().focus().undo().run(), disabled: () => !e.can().undo() })
  if (has('redo')) historyBtns.push({ id: 'redo', icon: 'arrow-rotate-top-right',   title: 'Redo', action: () => e.chain().focus().redo().run(), disabled: () => !e.can().redo() })
  if (historyBtns.length) groups.push({ id: 'history', buttons: historyBtns })

  return groups
})
</script>

<style lang="scss">
@use '../../../styles/mixins' as m;

.rich-text-editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);

  &__label {
    font-size: var(--font-size-s);
    font-weight: m.p('label-font-weight', 500);
    color: var(--color-foreground);
  }

  &__required {
    color: var(--color-error);
    margin-left: 2px;
  }

  &__container {
    display: flex;
    flex-direction: column;
    background: var(--color-background);
    border: 1px solid color-mix(in srgb, var(--color-foreground), transparent 80%);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &--focused {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary), transparent 82%);
    }

    &--error {
      border-color: var(--color-error);

      &.rich-text-editor__container--focused {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error), transparent 82%);
      }
    }

    &--disabled,
    &--readonly {
      opacity: 0.6;
      background: color-mix(in srgb, var(--color-foreground), transparent 96%);
      pointer-events: none;
    }
  }

  // --- Toolbar ---

  &__toolbar {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-s);
    border-bottom: 1px solid color-mix(in srgb, var(--color-foreground), transparent 88%);
    background: color-mix(in srgb, var(--color-foreground), transparent 97%);
  }

  &__toolbar-group {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  &__toolbar-divider {
    width: 1px;
    height: 18px;
    background: color-mix(in srgb, var(--color-foreground), transparent 85%);
    flex-shrink: 0;
  }

  &__toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: var(--border-radius-s);
    background: transparent;
    color: color-mix(in srgb, var(--color-foreground), transparent 30%);
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;

    &:hover:not(:disabled) {
      background: color-mix(in srgb, var(--color-foreground), transparent 90%);
      color: var(--color-foreground);
    }

    &--active {
      background: color-mix(in srgb, var(--color-primary), transparent 85%);
      color: var(--color-primary);

      &:hover:not(:disabled) {
        background: color-mix(in srgb, var(--color-primary), transparent 78%);
      }
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  &__toolbar-icon {
    width: 14px;
    height: 14px;
  }

  &__toolbar-label {
    font-family: var(--font-family-mono, ui-monospace, monospace);
    font-size: 0.65rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  // --- Editor content ---

  &__editor {
    flex: 1;
    overflow-y: auto;

    .tiptap {
      padding: var(--space);
      min-height: inherit;
      max-height: inherit;
      overflow-y: auto;
      outline: none;
      font-size: var(--font-size);
      line-height: 1.65;
      color: var(--color-foreground);

      // Placeholder
      p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        color: color-mix(in srgb, var(--color-foreground), transparent 55%);
        pointer-events: none;
        float: left;
        height: 0;
      }

      // Typography
      > * + * { margin-top: 0.65em; }

      h1, h2, h3, h4 {
        font-weight: 700;
        line-height: 1.2;
        color: var(--color-foreground);
      }
      h1 { font-size: 1.75em; }
      h2 { font-size: 1.35em; }
      h3 { font-size: 1.15em; }

      p { margin: 0; }

      strong { font-weight: 700; }
      em { font-style: italic; }
      u { text-decoration: underline; }
      s { text-decoration: line-through; }

      code {
        font-family: var(--font-family-mono, ui-monospace, monospace);
        font-size: 0.875em;
        background: color-mix(in srgb, var(--color-foreground), transparent 90%);
        border-radius: var(--border-radius-s);
        padding: 0.1em 0.35em;
      }

      pre {
        background: color-mix(in srgb, var(--color-foreground), transparent 92%);
        border-radius: var(--border-radius);
        padding: var(--space-s) var(--space);
        overflow-x: auto;

        code {
          background: none;
          padding: 0;
          font-size: var(--font-size-s);
        }
      }

      blockquote {
        border-left: 3px solid var(--color-primary);
        padding-left: var(--space);
        color: color-mix(in srgb, var(--color-foreground), transparent 30%);
        font-style: italic;
      }

      ul, ol {
        padding-left: var(--space-l);
      }
      ul { list-style: disc; }
      ol { list-style: decimal; }
      li + li { margin-top: 0.25em; }

      hr {
        border: none;
        border-top: 1px solid color-mix(in srgb, var(--color-foreground), transparent 85%);
        margin: var(--space) 0;
      }

      a {
        color: var(--color-primary);
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }

  &__error {
    font-size: var(--font-size-xs);
    color: var(--color-error);
  }
}
</style>
