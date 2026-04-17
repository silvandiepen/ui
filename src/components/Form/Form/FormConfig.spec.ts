import { describe, it, expect } from 'vitest'
import {
  evaluateCondition,
  evaluateConditions,
  validateValue,
  extractDefaultValues,
  getVisibleFields,
} from './FormConfig.utils'
import { useFormConfig } from './useFormConfig'
import type { FormConfig, FormConfigData, FormConfigFieldConfig } from './FormConfig.model'

// ---------------------------------------------------------------------------
// evaluateCondition
// ---------------------------------------------------------------------------
describe('evaluateCondition', () => {
  const data: FormConfigData = {
    name: 'Alice',
    age: 30,
    tags: ['vue', 'ts'],
    empty: '',
    nothing: null,
    role: 'admin',
  }

  it('eq – matches equal value', () => {
    expect(evaluateCondition({ field: 'name', operator: 'eq', value: 'Alice' }, data)).toBe(true)
  })

  it('eq – does not match different value', () => {
    expect(evaluateCondition({ field: 'name', operator: 'eq', value: 'Bob' }, data)).toBe(false)
  })

  it('neq – matches non-equal value', () => {
    expect(evaluateCondition({ field: 'name', operator: 'neq', value: 'Bob' }, data)).toBe(true)
  })

  it('neq – does not match equal value', () => {
    expect(evaluateCondition({ field: 'name', operator: 'neq', value: 'Alice' }, data)).toBe(false)
  })

  it('gt – passes when field value is greater', () => {
    expect(evaluateCondition({ field: 'age', operator: 'gt', value: 20 }, data)).toBe(true)
  })

  it('gt – fails when field value is not greater', () => {
    expect(evaluateCondition({ field: 'age', operator: 'gt', value: 30 }, data)).toBe(false)
  })

  it('gte – passes when field value is equal', () => {
    expect(evaluateCondition({ field: 'age', operator: 'gte', value: 30 }, data)).toBe(true)
  })

  it('gte – fails when field value is less', () => {
    expect(evaluateCondition({ field: 'age', operator: 'gte', value: 31 }, data)).toBe(false)
  })

  it('lt – passes when field value is less', () => {
    expect(evaluateCondition({ field: 'age', operator: 'lt', value: 50 }, data)).toBe(true)
  })

  it('lt – fails when field value is equal', () => {
    expect(evaluateCondition({ field: 'age', operator: 'lt', value: 30 }, data)).toBe(false)
  })

  it('lte – passes when field value is equal', () => {
    expect(evaluateCondition({ field: 'age', operator: 'lte', value: 30 }, data)).toBe(true)
  })

  it('lte – fails when field value is greater', () => {
    expect(evaluateCondition({ field: 'age', operator: 'lte', value: 29 }, data)).toBe(false)
  })

  it('contains – string contains substring', () => {
    expect(evaluateCondition({ field: 'name', operator: 'contains', value: 'lic' }, data)).toBe(true)
  })

  it('contains – array contains element', () => {
    expect(evaluateCondition({ field: 'tags', operator: 'contains', value: 'vue' }, data)).toBe(true)
  })

  it('contains – fails when not found', () => {
    expect(evaluateCondition({ field: 'name', operator: 'contains', value: 'xyz' }, data)).toBe(false)
  })

  it('notContains – passes when not found', () => {
    expect(evaluateCondition({ field: 'name', operator: 'notContains', value: 'xyz' }, data)).toBe(true)
  })

  it('notContains – fails when found', () => {
    expect(evaluateCondition({ field: 'name', operator: 'notContains', value: 'Alice' }, data)).toBe(false)
  })

  it('startsWith – passes', () => {
    expect(evaluateCondition({ field: 'name', operator: 'startsWith', value: 'Ali' }, data)).toBe(true)
  })

  it('startsWith – fails', () => {
    expect(evaluateCondition({ field: 'name', operator: 'startsWith', value: 'Bob' }, data)).toBe(false)
  })

  it('endsWith – passes', () => {
    expect(evaluateCondition({ field: 'name', operator: 'endsWith', value: 'ice' }, data)).toBe(true)
  })

  it('endsWith – fails', () => {
    expect(evaluateCondition({ field: 'name', operator: 'endsWith', value: 'ali' }, data)).toBe(false)
  })

  it('empty – passes for empty string', () => {
    expect(evaluateCondition({ field: 'empty', operator: 'empty' }, data)).toBe(true)
  })

  it('empty – passes for null', () => {
    expect(evaluateCondition({ field: 'nothing', operator: 'empty' }, data)).toBe(true)
  })

  it('empty – fails for non-empty', () => {
    expect(evaluateCondition({ field: 'name', operator: 'empty' }, data)).toBe(false)
  })

  it('notEmpty – passes for non-empty', () => {
    expect(evaluateCondition({ field: 'name', operator: 'notEmpty' }, data)).toBe(true)
  })

  it('notEmpty – fails for empty', () => {
    expect(evaluateCondition({ field: 'empty', operator: 'notEmpty' }, data)).toBe(false)
  })

  it('in – passes when value is in array', () => {
    expect(evaluateCondition({ field: 'role', operator: 'in', value: ['admin', 'editor'] }, data)).toBe(true)
  })

  it('in – fails when value is not in array', () => {
    expect(evaluateCondition({ field: 'role', operator: 'in', value: ['viewer', 'editor'] }, data)).toBe(false)
  })

  it('notIn – passes when value is not in array', () => {
    expect(evaluateCondition({ field: 'role', operator: 'notIn', value: ['viewer', 'editor'] }, data)).toBe(true)
  })

  it('notIn – fails when value is in array', () => {
    expect(evaluateCondition({ field: 'role', operator: 'notIn', value: ['admin', 'editor'] }, data)).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// evaluateConditions
// ---------------------------------------------------------------------------
describe('evaluateConditions', () => {
  const data: FormConfigData = { a: 1, b: 2, c: 3 }

  it('AND logic – all pass → true', () => {
    expect(
      evaluateConditions(
        [
          { field: 'a', operator: 'eq', value: 1 },
          { field: 'b', operator: 'eq', value: 2 },
        ],
        'and',
        data
      )
    ).toBe(true)
  })

  it('AND logic – one fails → false', () => {
    expect(
      evaluateConditions(
        [
          { field: 'a', operator: 'eq', value: 1 },
          { field: 'b', operator: 'eq', value: 99 },
        ],
        'and',
        data
      )
    ).toBe(false)
  })

  it('OR logic – any passes → true', () => {
    expect(
      evaluateConditions(
        [
          { field: 'a', operator: 'eq', value: 99 },
          { field: 'b', operator: 'eq', value: 2 },
        ],
        'or',
        data
      )
    ).toBe(true)
  })

  it('OR logic – none pass → false', () => {
    expect(
      evaluateConditions(
        [
          { field: 'a', operator: 'eq', value: 99 },
          { field: 'b', operator: 'eq', value: 99 },
        ],
        'or',
        data
      )
    ).toBe(false)
  })

  it('empty array → true', () => {
    expect(evaluateConditions([], 'and', data)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// validateValue
// ---------------------------------------------------------------------------
describe('validateValue', () => {
  it('required – empty string fails', () => {
    expect(validateValue('', [{ type: 'required', message: 'required' }], {})).toBe('required')
  })

  it('required – null fails', () => {
    expect(validateValue(null, [{ type: 'required', message: 'required' }], {})).toBe('required')
  })

  it('required – non-empty passes', () => {
    expect(validateValue('hello', [{ type: 'required', message: 'required' }], {})).toBeNull()
  })

  it('min – below threshold fails', () => {
    expect(validateValue(3, [{ type: 'min', value: 5, message: 'too small' }], {})).toBe('too small')
  })

  it('min – at threshold passes', () => {
    expect(validateValue(5, [{ type: 'min', value: 5, message: 'too small' }], {})).toBeNull()
  })

  it('min – null/empty passes (non-required)', () => {
    expect(validateValue(null, [{ type: 'min', value: 5, message: 'too small' }], {})).toBeNull()
  })

  it('max – above threshold fails', () => {
    expect(validateValue(10, [{ type: 'max', value: 5, message: 'too large' }], {})).toBe('too large')
  })

  it('max – at threshold passes', () => {
    expect(validateValue(5, [{ type: 'max', value: 5, message: 'too large' }], {})).toBeNull()
  })

  it('minLength – too short fails', () => {
    expect(validateValue('ab', [{ type: 'minLength', value: 5, message: 'too short' }], {})).toBe('too short')
  })

  it('minLength – exact length passes', () => {
    expect(validateValue('abcde', [{ type: 'minLength', value: 5, message: 'too short' }], {})).toBeNull()
  })

  it('maxLength – too long fails', () => {
    expect(validateValue('abcdef', [{ type: 'maxLength', value: 5, message: 'too long' }], {})).toBe('too long')
  })

  it('maxLength – exact length passes', () => {
    expect(validateValue('abcde', [{ type: 'maxLength', value: 5, message: 'too long' }], {})).toBeNull()
  })

  it('pattern – non-matching fails', () => {
    expect(validateValue('abc', [{ type: 'pattern', value: '^\\d+$', message: 'digits only' }], {})).toBe('digits only')
  })

  it('pattern – matching passes', () => {
    expect(validateValue('123', [{ type: 'pattern', value: '^\\d+$', message: 'digits only' }], {})).toBeNull()
  })

  it('email – invalid email fails', () => {
    expect(validateValue('notanemail', [{ type: 'email', message: 'invalid email' }], {})).toBe('invalid email')
  })

  it('email – valid email passes', () => {
    expect(validateValue('user@example.com', [{ type: 'email', message: 'invalid email' }], {})).toBeNull()
  })

  it('url – invalid url fails', () => {
    expect(validateValue('not-a-url', [{ type: 'url', message: 'invalid url' }], {})).toBe('invalid url')
  })

  it('url – valid url passes', () => {
    expect(validateValue('https://example.com', [{ type: 'url', message: 'invalid url' }], {})).toBeNull()
  })

  it('custom – validator returning false returns message', () => {
    expect(
      validateValue('bad', [{ type: 'custom', message: 'custom error', validator: () => false }], {})
    ).toBe('custom error')
  })

  it('custom – validator returning a string returns that string', () => {
    expect(
      validateValue('bad', [{ type: 'custom', message: 'custom error', validator: () => 'custom string error' }], {})
    ).toBe('custom string error')
  })

  it('custom – validator returning true passes', () => {
    expect(
      validateValue('good', [{ type: 'custom', message: 'custom error', validator: () => true }], {})
    ).toBeNull()
  })
})

// ---------------------------------------------------------------------------
// extractDefaultValues
// ---------------------------------------------------------------------------
describe('extractDefaultValues', () => {
  it('extracts defaults from flat fields', () => {
    const config: FormConfig = {
      fields: [
        { key: 'name', type: 'text', defaultValue: 'Alice' },
        { key: 'age', type: 'number', defaultValue: 25 },
        { key: 'email', type: 'email' },
      ],
    }
    const defaults = extractDefaultValues(config)
    expect(defaults.name).toBe('Alice')
    expect(defaults.age).toBe(25)
    expect('email' in defaults).toBe(false)
  })

  it('extracts defaults from step fields', () => {
    const config: FormConfig = {
      steps: [
        {
          id: 's1',
          title: 'Step 1',
          fields: [{ key: 'first', type: 'text', defaultValue: 'Bob' }],
        },
        {
          id: 's2',
          title: 'Step 2',
          fields: [{ key: 'second', type: 'text', defaultValue: 'Carol' }],
        },
      ],
    }
    const defaults = extractDefaultValues(config)
    expect(defaults.first).toBe('Bob')
    expect(defaults.second).toBe('Carol')
  })

  it('initialValues override field defaults', () => {
    const config: FormConfig = {
      fields: [{ key: 'name', type: 'text', defaultValue: 'Alice' }],
      initialValues: { name: 'Override' },
    }
    const defaults = extractDefaultValues(config)
    expect(defaults.name).toBe('Override')
  })

  it('fields without defaultValue are not included', () => {
    const config: FormConfig = {
      fields: [{ key: 'name', type: 'text' }],
    }
    const defaults = extractDefaultValues(config)
    expect('name' in defaults).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// getVisibleFields
// ---------------------------------------------------------------------------
describe('getVisibleFields', () => {
  const fields: FormConfigFieldConfig[] = [
    { key: 'always', type: 'text' },
    {
      key: 'conditional',
      type: 'text',
      condition: { field: 'show', operator: 'eq', value: true },
    },
  ]

  it('shows field when condition passes', () => {
    const visible = getVisibleFields(fields, { show: true })
    expect(visible.map((f) => f.key)).toContain('conditional')
  })

  it('hides field when condition fails', () => {
    const visible = getVisibleFields(fields, { show: false })
    expect(visible.map((f) => f.key)).not.toContain('conditional')
  })

  it('always shows field with no condition', () => {
    const visible = getVisibleFields(fields, {})
    expect(visible.map((f) => f.key)).toContain('always')
  })
})

// ---------------------------------------------------------------------------
// useFormConfig composable
// ---------------------------------------------------------------------------
describe('useFormConfig', () => {
  const makeConfig = (): FormConfig => ({
    fields: [
      { key: 'name', type: 'text', defaultValue: 'Alice', required: true },
      { key: 'email', type: 'email', defaultValue: '' },
    ],
  })

  it('initialises values from defaults', () => {
    const form = useFormConfig(makeConfig())
    expect(form.values.value.name).toBe('Alice')
    expect(form.values.value.email).toBe('')
  })

  it('setValue updates the value', () => {
    const form = useFormConfig(makeConfig())
    form.setValue('name', 'Bob')
    expect(form.values.value.name).toBe('Bob')
  })

  it('setValue clears that field error', () => {
    const form = useFormConfig(makeConfig())
    form.setError('name', 'required')
    form.setValue('name', 'Bob')
    expect(form.errors.value.name).toBeUndefined()
  })

  it('validateField sets error on failure', () => {
    const form = useFormConfig(makeConfig())
    form.setValue('name', '')
    form.validateField('name')
    expect(form.errors.value.name).toBeTruthy()
  })

  it('validateField clears error on success', () => {
    const form = useFormConfig(makeConfig())
    form.setError('name', 'some error')
    form.setValue('name', 'Valid name')
    form.validateField('name')
    expect(form.errors.value.name).toBeUndefined()
  })

  it('validateField skips invisible field', () => {
    const config: FormConfig = {
      fields: [
        { key: 'toggle', type: 'toggle', defaultValue: false },
        {
          key: 'conditional',
          type: 'text',
          required: true,
          condition: { field: 'toggle', operator: 'eq', value: true },
        },
      ],
    }
    const form = useFormConfig(config)
    // conditional is invisible (toggle is false), so should not set error
    form.validateField('conditional')
    expect(form.errors.value.conditional).toBeUndefined()
  })

  it('validateStep validates all visible step fields', () => {
    const form = useFormConfig(makeConfig())
    form.setValue('name', '') // required, empty → error
    const result = form.validateStep()
    expect(result).toBe(false)
    expect(form.errors.value.name).toBeTruthy()
  })

  it('reset restores defaults and clears errors/touched', () => {
    const form = useFormConfig(makeConfig())
    form.setValue('name', 'Changed')
    form.setError('name', 'err')
    form.setTouched('name')
    form.reset()
    expect(form.values.value.name).toBe('Alice')
    expect(Object.keys(form.errors.value).length).toBe(0)
    expect(Object.keys(form.touched.value).length).toBe(0)
  })

  it('isMultiStep is false for flat form', () => {
    const form = useFormConfig(makeConfig())
    expect(form.isMultiStep.value).toBe(false)
  })

  it('isMultiStep is true for step form', () => {
    const config: FormConfig = {
      steps: [
        { id: 's1', title: 'Step 1', fields: [{ key: 'a', type: 'text' }] },
        { id: 's2', title: 'Step 2', fields: [{ key: 'b', type: 'text' }] },
      ],
    }
    const form = useFormConfig(config)
    expect(form.isMultiStep.value).toBe(true)
  })

  it('nextStep advances step when validation passes', () => {
    const config: FormConfig = {
      steps: [
        { id: 's1', title: 'Step 1', fields: [{ key: 'a', type: 'text' }] },
        { id: 's2', title: 'Step 2', fields: [{ key: 'b', type: 'text' }] },
      ],
    }
    const form = useFormConfig(config)
    expect(form.currentStepIndex.value).toBe(0)
    const result = form.nextStep()
    expect(result).toBe(true)
    expect(form.currentStepIndex.value).toBe(1)
  })

  it('nextStep does not advance when validation fails', () => {
    const config: FormConfig = {
      steps: [
        {
          id: 's1',
          title: 'Step 1',
          fields: [{ key: 'required_field', type: 'text', required: true }],
        },
        { id: 's2', title: 'Step 2', fields: [{ key: 'b', type: 'text' }] },
      ],
    }
    const form = useFormConfig(config)
    // required_field is empty → should fail
    const result = form.nextStep()
    expect(result).toBe(false)
    expect(form.currentStepIndex.value).toBe(0)
  })

  it('prevStep decrements step', () => {
    const config: FormConfig = {
      steps: [
        { id: 's1', title: 'Step 1', fields: [{ key: 'a', type: 'text' }] },
        { id: 's2', title: 'Step 2', fields: [{ key: 'b', type: 'text' }] },
      ],
    }
    const form = useFormConfig(config)
    form.goToStep(1)
    const result = form.prevStep()
    expect(result).toBe(true)
    expect(form.currentStepIndex.value).toBe(0)
  })

  it('prevStep returns false when on first step', () => {
    const config: FormConfig = {
      steps: [{ id: 's1', title: 'Step 1', fields: [] }],
    }
    const form = useFormConfig(config)
    expect(form.prevStep()).toBe(false)
  })

  it('visibleFields reactively filters by condition', () => {
    const config: FormConfig = {
      fields: [
        { key: 'toggle', type: 'toggle', defaultValue: false },
        {
          key: 'shown_when_true',
          type: 'text',
          condition: { field: 'toggle', operator: 'eq', value: true },
        },
      ],
    }
    const form = useFormConfig(config)
    expect(form.visibleFields.value.map((f) => f.key)).not.toContain('shown_when_true')
    form.setValue('toggle', true)
    expect(form.visibleFields.value.map((f) => f.key)).toContain('shown_when_true')
  })

  it('isDirty is false on init', () => {
    const form = useFormConfig(makeConfig())
    expect(form.isDirty.value).toBe(false)
  })

  it('isDirty is true when value differs from default', () => {
    const form = useFormConfig(makeConfig())
    form.setValue('name', 'Changed')
    expect(form.isDirty.value).toBe(true)
  })

  it('setTouched + validateOnBlur triggers validation', () => {
    const config: FormConfig = {
      validateOnBlur: true,
      fields: [{ key: 'name', type: 'text', required: true }],
    }
    const form = useFormConfig(config)
    // name is empty, touch it to trigger validation
    form.setTouched('name')
    expect(form.errors.value.name).toBeTruthy()
  })
})
