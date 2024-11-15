'use client'

import { toast as sonnerToast } from 'sonner'

type ToastProps = {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

const showToast = (props: ToastProps) => {
  if (props.variant === 'destructive') {
    return sonnerToast.error(props.title || '', {
      description: props.description,
      dismissible: true,
      duration: 2000
    })
  }
  return sonnerToast.success(props.title || '', {
    description: props.description,
    dismissible: true,
    duration: 2000
  })
}

export const toast = {
  error: (message: string) => sonnerToast.error(message),
  success: (message: string) => sonnerToast.success(message),
  promise: sonnerToast.promise,
  dismiss: () => sonnerToast.dismiss()
}

export function useToast() {
  return {
    toast: showToast,
    dismiss: toast.dismiss
  }
}
