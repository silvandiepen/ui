# Form

`Form` is the concrete form container exported as `UIForm`. It provides submission handling, shared field context, validation hooks, and layout structure for the shared `T*` input family.

## What It Does

- Wraps related `T*` inputs in one form surface.
- Coordinates submit handling and browser `FormData`.
- Exposes shared context used by nested fields, validation, and grouped controls.
- Works as the concrete component behind the broader `UIForms` namespace.

## `UIForms` vs `UIForm`

- `UIForms` is the namespace export that groups `Form`, `FormField`, `InputText`, `InputSelect`, and the rest of the shared form primitives.
- `UIForm` is the specific form wrapper component documented on this page.

## Basic Usage

```vue
<template>
  <Form @submit="handleSubmit">
    <InputText
      name="username"
      label="Username"
      required
    />

    <InputEmail
      name="email"
      label="Email"
      required
    />

    <Button type="submit">Submit</Button>
  </Form>
</template>

<script setup>
import { Form, InputText, InputEmail, Button } from '@tiko/ui'

const handleSubmit = (event, formData) => {
  console.log('Form submitted:', Object.fromEntries(formData))
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | `undefined` | Form ID attribute |
| `name` | `string` | `undefined` | Form name attribute |
| `disabled` | `boolean` | `false` | Disable entire form |
| `loading` | `boolean` | `false` | Form loading state |
| `method` | `'get' \| 'post'` | `'post'` | Form method |
| `action` | `string` | `undefined` | Form action URL |
| `preventDefault` | `boolean` | `true` | Prevent default submission |
| `validationMode` | `string` | `'onSubmit'` | When to validate: 'onSubmit', 'onChange', 'onBlur' |
| `showErrors` | `boolean` | `true` | Show validation errors |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `submit` | `[event: Event, formData: FormData]` | Form submitted |
| `validation-error` | `[errors: Record<string, string>]` | Validation failed |
| `reset` | - | Form reset |

## Slot Props

The default slot receives these props:

| Prop | Type | Description |
|------|------|-------------|
| `isValid` | `boolean` | Whether form is valid |
| `errors` | `Record<string, string>` | Current validation errors |
| `submit` | `() => void` | Submit form programmatically |
| `reset` | `() => void` | Reset form programmatically |

## FormField

`FormField` is the label/input wrapper. It now supports inline row layout for compact control rows.

### `FormField` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | - | Field name |
| `label` | `string` | `undefined` | Field label |
| `description` | `string` | `undefined` | Helper text |
| `required` | `boolean` | `false` | Show required marker |
| `error` | `string` | `undefined` | Manual error message |
| `showError` | `boolean` | `true` | Render error state |
| `direction` | `'row' \| 'column'` | `'column'` | Label/input layout direction |
| `gap` | `string` | `'var(--space-xs)'` | Gap between label and input |
| `labelWidth` | `string` | `'auto'` | Label width when using row layout |
| `align` | `'stretch' \| 'flex-start' \| 'center' \| 'flex-end'` | `'center'` | Cross-axis alignment |

### `FormField` Inline Example

```vue
<FormField
  name="rgb-r"
  label="R"
  direction="row"
  label-width="1.25rem"
  :show-error="false"
>
  <InputNumber v-model="r" :label="''" :controls="false" :min="0" :max="255" />
</FormField>
```

## FormGroup

`FormGroup` is the spacing/layout container for multiple fields.

### `FormGroup` Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'row' \| 'column'` | `'column'` | Child flow direction |
| `gap` | `string` | `'var(--space)'` | Gap between children |
| `wrap` | `boolean` | `false` | Wrap children when in row mode |
| `align` | `'stretch' \| 'flex-start' \| 'center' \| 'flex-end'` | `'stretch'` | Cross-axis alignment |
| `justify` | `'flex-start' \| 'center' \| 'flex-end' \| 'space-between' \| 'space-around'` | `'flex-start'` | Main-axis alignment |
| `padding` | `string` | `'0'` | Group padding |
| `bordered` | `boolean` | `false` | Adds bordered container styling |
| `label` | `string` | `undefined` | Optional group title |
| `description` | `string` | `undefined` | Optional description text |
| `collapsible` | `boolean` | `false` | Enable toggle behavior |
| `collapsed` | `boolean` | `false` | Initial collapsed state |

### `FormGroup` Row Example

```vue
<FormGroup direction="row" :wrap="true" gap="var(--space-xs)">
  <FormField name="h" label="H" direction="row" label-width="1.25rem" :show-error="false">
    <InputNumber v-model="h" :label="''" :controls="false" :min="0" :max="360" />
  </FormField>
  <FormField name="s" label="S" direction="row" label-width="1.25rem" :show-error="false">
    <InputNumber v-model="s" :label="''" :controls="false" :min="0" :max="100" />
  </FormField>
</FormGroup>
```

## Examples

### Simple Contact Form

```vue
<template>
  <Form
    @submit="sendMessage"
    :loading="isSending"
  >
    <FormField label="Name" required>
      <InputText
        name="name"
        placeholder="Your name"
      />
    </FormField>

    <FormField label="Email" required>
      <InputEmail
        name="email"
        placeholder="your@email.com"
      />
    </FormField>

    <FormField label="Message" required>
      <InputTextArea
        name="message"
        placeholder="Your message"
        :rows="5"
      />
    </FormField>

    <Button type="submit" :loading="isSending">
      Send Message
    </Button>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Form, FormField, InputText, InputEmail, InputTextArea, Button } from '@tiko/ui'

const isSending = ref(false)

const sendMessage = async (event, formData) => {
  isSending.value = true

  try {
    await fetch('/api/contact', {
      method: 'POST',
      body: formData
    })

    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    isSending.value = false
  }
}
</script>
```

### With Validation

```vue
<template>
  <Form
    @submit="handleSubmit"
    @validation-error="handleErrors"
    validation-mode="onChange"
  >
    <InputText
      name="username"
      label="Username"
      required
      :min-length="3"
      :max-length="20"
      pattern="^[a-zA-Z0-9_]+$"
      error="Username must be 3-20 characters, alphanumeric only"
    />

    <InputPassword
      name="password"
      label="Password"
      required
      :min-length="8"
      error="Password must be at least 8 characters"
    />

    <InputPassword
      name="confirmPassword"
      label="Confirm Password"
      required
      :must-match="password"
      error="Passwords must match"
    />

    <Button type="submit">Register</Button>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Form, InputText, InputPassword, Button } from '@tiko/ui'

const password = ref('')

const handleSubmit = (event, formData) => {
  console.log('Valid form submitted')
}

const handleErrors = (errors) => {
  console.log('Validation errors:', errors)
}
</script>
```

### Using Slot Props

```vue
<template>
  <Form
    @submit="saveSettings"
    #default="{ isValid, errors, submit, reset }"
  >
    <FormGroup label="Profile Settings">
      <InputText name="displayName" label="Display Name" />
      <InputTextArea name="bio" label="Bio" />
    </FormGroup>

    <FormGroup label="Preferences">
      <InputToggle name="notifications" label="Enable Notifications" />
      <InputSelect
        name="theme"
        label="Theme"
        :options="['Light', 'Dark', 'Auto']"
      />
    </FormGroup>

    <div class="form-info">
      <p v-if="!isValid" class="error">
        Please fix the following errors:
        <ul>
          <li v-for="(error, field) in errors" :key="field">
            {{ field }}: {{ error }}
          </li>
        </ul>
      </p>
    </div>

    <ButtonGroup>
      <Button @click="reset" type="ghost">
        Reset
      </Button>
      <Button
        @click="submit"
        :disabled="!isValid"
      >
        Save Settings
      </Button>
    </ButtonGroup>
  </Form>
</template>
```

### Multi-Step Form

```vue
<template>
  <Form
    @submit="completeSignup"
    :disabled="isProcessing"
  >
    <!-- Step 1: Account Info -->
    <div v-if="currentStep === 1">
      <h3>Account Information</h3>
      <InputEmail
        v-model="formData.email"
        name="email"
        label="Email"
        required
      />
      <InputPassword
        v-model="formData.password"
        name="password"
        label="Password"
        required
      />
    </div>

    <!-- Step 2: Personal Info -->
    <div v-if="currentStep === 2">
      <h3>Personal Information</h3>
      <InputText
        v-model="formData.firstName"
        name="firstName"
        label="First Name"
        required
      />
      <InputText
        v-model="formData.lastName"
        name="lastName"
        label="Last Name"
        required
      />
    </div>

    <!-- Step 3: Preferences -->
    <div v-if="currentStep === 3">
      <h3>Preferences</h3>
      <InputSelect
        v-model="formData.language"
        name="language"
        label="Language"
        :options="languages"
      />
      <InputToggle
        v-model="formData.newsletter"
        name="newsletter"
        label="Subscribe to newsletter"
      />
    </div>

    <!-- Navigation -->
    <ButtonGroup>
      <Button
        v-if="currentStep > 1"
        @click="previousStep"
        type="ghost"
      >
        Previous
      </Button>

      <Button
        v-if="currentStep < 3"
        @click="nextStep"
      >
        Next
      </Button>

      <Button
        v-if="currentStep === 3"
        type="submit"
      >
        Complete Signup
      </Button>
    </ButtonGroup>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Form, InputEmail, InputPassword, InputText, InputSelect, InputToggle, Button, ButtonGroup } from '@tiko/ui'

const currentStep = ref(1)
const isProcessing = ref(false)

const formData = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  language: 'en',
  newsletter: true
})

const languages = ['English', 'Spanish', 'French', 'German']

const nextStep = () => {
  currentStep.value++
}

const previousStep = () => {
  currentStep.value--
}

const completeSignup = async (event, formData) => {
  isProcessing.value = true
  // Process signup
}
</script>
```

### Dynamic Form Fields

```vue
<template>
  <Form @submit="saveItems">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="form-row"
    >
      <InputText
        :name="`items[${index}].name`"
        placeholder="Item name"
        v-model="item.name"
      />

      <InputNumber
        :name="`items[${index}].quantity`"
        placeholder="Quantity"
        v-model="item.quantity"
        :min="1"
      />

      <Button
        @click="removeItem(index)"
        icon="trash"
        type="ghost"
        size="small"
      />
    </div>

    <Button
      @click="addItem"
      type="outline"
      icon="plus"
    >
      Add Item
    </Button>

    <Button type="submit">
      Save Items
    </Button>
  </Form>
</template>

<script setup>
import { ref } from 'vue'
import { Form, InputText, InputNumber, Button } from '@tiko/ui'

const items = ref([
  { id: 1, name: '', quantity: 1 }
])

const addItem = () => {
  items.value.push({
    id: Date.now(),
    name: '',
    quantity: 1
  })
}

const removeItem = (index) => {
  items.value.splice(index, 1)
}

const saveItems = (event, formData) => {
  console.log('Items:', items.value)
}
</script>
```

### File Upload Form

```vue
<template>
  <Form
    @submit="uploadFiles"
    enctype="multipart/form-data"
  >
    <FormField label="Profile Picture">
      <InputFile
        name="avatar"
        accept="image/*"
        :max-size="5 * 1024 * 1024"
      />
    </FormField>

    <FormField label="Documents">
      <InputFile
        name="documents"
        accept=".pdf,.doc,.docx"
        multiple
        :max-files="5"
      />
    </FormField>

    <Button type="submit">
      Upload Files
    </Button>
  </Form>
</template>

<script setup>
import { Form, FormField, InputFile, Button } from '@tiko/ui'

const uploadFiles = async (event, formData) => {
  // FormData includes file inputs
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
}
</script>
```

## Form Context

Form provides context to all child components:

```javascript
// Available in child components via inject('formContext')
{
  disabled: boolean,     // Form disabled state
  loading: boolean,      // Form loading state
  validationMode: string, // Validation mode
  showErrors: boolean,   // Show errors flag
  errors: Object,        // Current errors
  touched: Object,       // Touched fields
  setError: Function,    // Set field error
  clearError: Function,  // Clear field error
  setTouched: Function   // Mark field as touched
}
```

## Styling

The form component uses minimal styling:

```css
.form {
  /* Basic form layout */
  display: flex;
  flex-direction: column;
  gap: var(--space);
  width: 100%;
}

.form--disabled {
  /* Disabled state */
  opacity: 0.6;
  pointer-events: none;
}

.form--loading {
  /* Loading overlay */
  position: relative;
}
```

## Accessibility

- Semantic form element
- Proper form submission handling
- ARIA attributes for validation states
- Keyboard navigation support
- Screen reader announcements for errors

## Best Practices

1. **Use FormField wrapper** - Provides consistent label/error layout
2. **Set validation mode** - Choose appropriate validation timing
3. **Handle errors properly** - Show clear error messages
4. **Prevent double submission** - Use loading states
5. **Progressive enhancement** - Forms work without JavaScript
6. **Clear success feedback** - Show when form submits successfully
7. **Test validation** - Ensure all edge cases are handled

## Related Components

- `FormField` - Individual form field wrapper
- `FormGroup` - Group related form fields
- All `Input*` components - Form input elements
- `Button` - Form submission buttons
