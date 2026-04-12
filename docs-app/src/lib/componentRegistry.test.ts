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
      UITruncatedChipList: '../../../src/components/Display/TruncatedChipList.example.vue',
      UIInputEmail: '../../../src/components/Form/TForm/InputEmail/InputEmail.example.vue',
      UIColorPickerPopup: '../../../src/components/Form/TColorPickerPopup/TColorPickerPopup.example.vue',
      UIFormActions: '../../../src/components/Form/TFormActions/TFormActions.example.vue',
      UIImageInput: '../../../src/components/Form/TImageInput/TImageInput.example.vue',
      UIInputCheckbox: '../../../src/components/Form/TForm/inputs/TInputCheckbox/TInputCheckbox.example.vue',
      UIInputCustomSelect: '../../../src/components/Form/TForm/inputs/TInputCustomSelect/TInputCustomSelect.example.vue',
      UIInputNumber: '../../../src/components/Form/TForm/inputs/TInputNumber/TInputNumber.example.vue',
      UIInputRadio: '../../../src/components/Form/TForm/inputs/TInputRadio/TInputRadio.example.vue',
      UIInputSelect: '../../../src/components/Form/TForm/inputs/TInputSelect/TInputSelect.example.vue',
      UIInputSwitch: '../../../src/components/Form/TForm/inputs/TInputSwitch/TInputSwitch.example.vue',
      UIInputText: '../../../src/components/Form/TForm/inputs/TInputText/TInputText.example.vue',
      UIInputTextArea: '../../../src/components/Form/TForm/inputs/TInputTextArea/TInputTextArea.example.vue',
      UIInputToggle: '../../../src/components/Form/TForm/inputs/TInputToggle/TInputToggle.example.vue',
      UIRichTextEditor: '../../../src/components/Form/TRichTextEditor/TRichTextEditor.example.vue',
      UIPopup: '../../../src/components/Feedback/Popup/Popup.example.vue',
    }

    const catalog = getComponentCatalog()
    const missingExamples = Object.entries(requiredExamples).filter(([apiName, examplePath]) => {
      const entry = catalog.find((item) => item.apiName === apiName)

      return !entry || entry.examplePath !== examplePath
    })

    expect(missingExamples).toEqual([])
  })
})
