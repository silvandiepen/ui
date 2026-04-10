import { inject } from 'vue'
import type { PopupService } from '../components/Feedback/Popup/Popup.service'

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'success' | 'warning' | 'error'
  icon?: string
}

export function useConfirm() {
  const popupService = inject('popupService') as PopupService
  
  if (!popupService) {
    throw new Error('useConfirm: popupService not found. Make sure to install the popup plugin.')
  }
  
  const confirm = (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      let popupId: string
      
      popupId = popupService.showPopup({
        component: 'ConfirmDialog',
        props: {
          title: options.title,
          message: options.message,
          confirmLabel: options.confirmLabel || 'Confirm',
          cancelLabel: options.cancelLabel || 'Cancel',
          confirmColor: options.confirmColor || 'primary',
          icon: options.icon || 'help-circle',
          onConfirm: () => {
            popupService.closePopup({ id: popupId })
            resolve(true)
          },
          onCancel: () => {
            popupService.closePopup({ id: popupId })
            resolve(false)
          }
        }
      })
    })
  }
  
  // Convenience methods for common use cases
  const confirmDelete = (itemName: string): Promise<boolean> => {
    return confirm({
      title: 'Delete Item',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmColor: 'error',
      icon: 'trash'
    })
  }
  
  const confirmArchive = (itemName: string): Promise<boolean> => {
    return confirm({
      title: 'Archive Item',
      message: `Are you sure you want to archive "${itemName}"?`,
      confirmLabel: 'Archive',
      icon: 'archive'
    })
  }
  
  const confirmAction = (title: string, message: string, confirmLabel = 'Confirm'): Promise<boolean> => {
    return confirm({
      title,
      message,
      confirmLabel
    })
  }
  
  return {
    confirm,
    confirmDelete,
    confirmArchive,
    confirmAction
  }
}