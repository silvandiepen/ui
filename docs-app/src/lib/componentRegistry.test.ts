import { describe, expect, it } from 'vitest'

import { getComponentCatalog } from './componentRegistry'

describe('component registry', () => {
  it('keeps live examples wired for the docs surfaces that rely on them', () => {
    const requiredExamples: Record<string, string> = {
      UIChip: '../../../src/components/Display/Chip.example.vue',
      UIChipGroup: '../../../src/components/Display/ChipGroup.example.vue',
      UIColumns: '../../../src/components/Display/Columns.example.vue',
      UIContextPanel: '../../../src/components/ContextMenu/ContextPanel.example.vue',
      UIDL: '../../../src/components/Display/DL.example.vue',
      UIEmpty: '../../../src/components/Display/Empty.example.vue',
      UIID: '../../../src/components/Display/ID.example.vue',
      UINote: '../../../src/components/Display/Note.example.vue',
      UIRow: '../../../src/components/Display/Row.example.vue',
      UITruncatedList: '../../../src/components/Display/TruncatedList.example.vue',
      UIInputEmail: '../../../src/components/Form/InputEmail/InputEmail.example.vue',
      UIColorPickerPopup: '../../../src/components/Form/ColorPickerPopup/ColorPickerPopup.example.vue',
      UIFormActions: '../../../src/components/Form/FormActions/FormActions.example.vue',
      UIHeaderSearch: '../../../src/components/HeaderSearch/HeaderSearch.example.vue',
      UIImageInput: '../../../src/components/Form/ImageInput/ImageInput.example.vue',
      UIInputCheckbox: '../../../src/components/Form/InputCheckbox/InputCheckbox.example.vue',
      UIInputCustomSelect: '../../../src/components/Form/InputCustomSelect/InputCustomSelect.example.vue',
      UIDatePicker: '../../../src/components/Form/DatePicker/DatePicker.example.vue',
      UIInputNumber: '../../../src/components/Form/InputNumber/InputNumber.example.vue',
      UIInputRadio: '../../../src/components/Form/InputRadio/InputRadio.example.vue',
      UIInputSelect: '../../../src/components/Form/InputSelect/InputSelect.example.vue',
      UIInputSwitch: '../../../src/components/Form/InputSwitch/InputSwitch.example.vue',
      UIInputSwitchOptions: '../../../src/components/Form/InputSwitchOptions/InputSwitchOptions.example.vue',
      UIInputText: '../../../src/components/Form/InputText/InputText.example.vue',
      UIInputTextArea: '../../../src/components/Form/InputTextArea/InputTextArea.example.vue',
      UIInputToggle: '../../../src/components/Form/InputToggle/InputToggle.example.vue',
      UILanguageSwitch: '../../../src/components/LanguageSwitch/LanguageSwitch.example.vue',
      UIRichTextEditor: '../../../src/components/Form/RichTextEditor/RichTextEditor.example.vue',
      UIPopup: '../../../src/components/Feedback/Popup/Popup.example.vue',
      UISearchResults: '../../../src/components/SearchResults/SearchResults.example.vue',
    }

    const catalog = getComponentCatalog()
    const missingExamples = Object.entries(requiredExamples).filter(([apiName, examplePath]) => {
      const entry = catalog.find((item) => item.apiName === apiName)

      return !entry || entry.examplePath !== examplePath
    })

    expect(missingExamples).toEqual([])
  })
})
