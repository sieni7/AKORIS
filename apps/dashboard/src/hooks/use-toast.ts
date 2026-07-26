import { useUIStore } from '../lib/store';

export function toast(options: { title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) {
  const typeMap: Record<string, 'success' | 'error' | 'info'> = {
    default: 'info',
    destructive: 'error',
    success: 'success',
  };
  useUIStore.getState().addNotification({
    type: typeMap[options.variant ?? 'default'],
    title: options.title,
    message: options.description ?? '',
  });
}
