import type { FormConfig, FormConfigFieldConfig, FormConfigFieldType } from '@ui-lib/components/Form/Form/FormConfig.model'

export interface FieldTypeDefinition {
  type: FormConfigFieldType
  label: string
  icon: string
  defaultConfig: Partial<FormConfigFieldConfig>
}

export interface FormBuilderState {
  config: FormConfig
  selectedFieldKey: string | null
  showPreview: boolean
  activePanel: 'field' | 'form'
}

export const FIELD_TYPE_DEFINITIONS: FieldTypeDefinition[] = [
  { type: 'text',      label: 'Text',      icon: 'type',         defaultConfig: { label: 'Text', placeholder: 'Enter text...' } },
  { type: 'email',     label: 'Email',     icon: 'mail',         defaultConfig: { label: 'Email', placeholder: 'you@example.com', validation: [{ type: 'email', message: 'Enter a valid email' }] } },
  { type: 'password',  label: 'Password',  icon: 'lock',         defaultConfig: { label: 'Password', placeholder: 'Enter password...' } },
  { type: 'number',    label: 'Number',    icon: 'hash',         defaultConfig: { label: 'Number', placeholder: '0' } },
  { type: 'textarea',  label: 'Textarea',  icon: 'align-left',   defaultConfig: { label: 'Message', placeholder: 'Enter message...', cols: 2 } },
  { type: 'select',    label: 'Select',    icon: 'chevron-down', defaultConfig: { label: 'Select', options: [{ label: 'Option 1', value: 'option-1' }, { label: 'Option 2', value: 'option-2' }] } },
  { type: 'radio',     label: 'Radio',     icon: 'circle',       defaultConfig: { label: 'Choice', options: [{ label: 'Option A', value: 'a' }, { label: 'Option B', value: 'b' }] } },
  { type: 'checkbox',  label: 'Checkbox',  icon: 'check-square', defaultConfig: { label: 'I agree', defaultValue: false } },
  { type: 'toggle',    label: 'Toggle',    icon: 'toggle-right', defaultConfig: { label: 'Enable', defaultValue: false } },
  { type: 'switch',    label: 'Switch',    icon: 'sliders',      defaultConfig: { label: 'Options', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }] } },
  { type: 'date',      label: 'Date',      icon: 'calendar',     defaultConfig: { label: 'Date' } },
  { type: 'color',     label: 'Color',     icon: 'droplet',      defaultConfig: { label: 'Color', defaultValue: '#000000' } },
  { type: 'range',     label: 'Range',     icon: 'sliders',      defaultConfig: { label: 'Range', defaultValue: 50 } },
  { type: 'divider',   label: 'Divider',   icon: 'minus',        defaultConfig: {} },
  { type: 'section',   label: 'Section',   icon: 'layout',       defaultConfig: { label: 'Section Title', hint: 'Section description' } },
]
