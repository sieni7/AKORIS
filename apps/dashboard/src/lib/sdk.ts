import { AKORISClient } from '@akoris/sdk';
import { useUIStore } from './store';

const API_URL = '/api';

export const client = new AKORISClient({ baseUrl: API_URL });

export function withNotifications<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: { successMessage?: string; errorMessage?: string },
): T {
  const addNotification = useUIStore.getState().addNotification;
  return ((...args: any[]) => {
    return fn(...args)
      .then((result: any) => {
        if (options?.successMessage) {
          addNotification({ type: 'success', title: 'Succès', message: options.successMessage });
        }
        return result;
      })
      .catch((error: any) => {
        addNotification({
          type: 'error',
          title: 'Erreur',
          message: options?.errorMessage || error?.message || 'Une erreur est survenue',
        });
        throw error;
      });
  }) as T;
}

export function useAKORIS() {
  return { client, withNotifications };
}
