import { inject } from 'vue'
import type { PopupService } from '../components/Feedback/Popup/Popup.service'

export interface InputOptions {
  title: string
  message?: string
  placeholder?: string
  initialValue?: string
  confirmLabel?: string
  cancelLabel?: string
  validate?: (value: string) => boolean | string
  type?: 'text' | 'email' | 'number' | 'password'
}

export function useInput() {
  const popupService = inject('popupService') as PopupService
  
  if (!popupService) {
    throw new Error('useInput: popupService not found. Make sure to install the popup plugin.')
  }
  
  const input = (options: InputOptions): Promise<string | null> => {
    return new Promise((resolve) => {
      const popupId = popupService.showPopup({
        component: 'InputDialog',
        props: {
          title: options.title,
          message: options.message,
          placeholder: options.placeholder,
          initialValue: options.initialValue || '',
          confirmLabel: options.confirmLabel || 'OK',
          cancelLabel: options.cancelLabel || 'Cancel',
          validate: options.validate,
          type: options.type || 'text',
          popupId: '', // Will be set after creation
          onConfirm: (value: string) => {
            popupService.closePopup({ id: popupId })
            resolve(value)
          },
          onCancel: () => {
            popupService.closePopup({ id: popupId })
            resolve(null)
          }
        }
      })
    })
  }
  
  // Convenience methods
  const prompt = (title: string, message?: string): Promise<string | null> => {
    return input({ title, message })
  }
  
  const promptWithValidation = (
    title: string, 
    validate: (value: string) => boolean | string,
    message?: string
  ): Promise<string | null> => {
    return input({ title, message, validate })
  }
  
  return {
    input,
    prompt,
    promptWithValidation
  }
}