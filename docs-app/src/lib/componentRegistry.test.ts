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
      UIInputEmail: '../../../src/components/Form/Form/InputEmail/InputEmail.example.vue',
      UIColorPickerPopup: '../../../src/components/Form/ColorPickerPopup/ColorPickerPopup.example.vue',
      UIFormActions: '../../../src/components/Form/FormActions/FormActions.example.vue',
      UIHeaderSearch: '../../../src/components/HeaderSearch/HeaderSearch.example.vue',
      UIImageInput: '../../../src/components/Form/ImageInput/ImageInput.example.vue',
      UIInputCheckbox: '../../../src/components/Form/Form/inputs/InputCheckbox/InputCheckbox.example.vue',
      UIInputCustomSelect: '../../../src/components/Form/Form/inputs/InputCustomSelect/InputCustomSelect.example.vue',
      UIInputNumber: '../../../src/components/Form/Form/inputs/InputNumber/InputNumber.example.vue',
      UIInputRadio: '../../../src/components/Form/Form/inputs/InputRadio/InputRadio.example.vue',
      UIInputSelect: '../../../src/components/Form/Form/inputs/InputSelect/InputSelect.example.vue',
      UIInputSwitch: '../../../src/components/Form/Form/inputs/InputSwitch/InputSwitch.example.vue',
      UIInputSwitchOptions: '../../../src/components/Form/Form/inputs/InputSwitchOptions/InputSwitchOptions.example.vue',
      UIInputText: '../../../src/components/Form/Form/inputs/InputText/InputText.example.vue',
      UIInputTextArea: '../../../src/components/Form/Form/inputs/InputTextArea/InputTextArea.example.vue',
      UIInputToggle: '../../../src/components/Form/Form/inputs/InputToggle/InputToggle.example.vue',
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
