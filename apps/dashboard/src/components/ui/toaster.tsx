import { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useUIStore } from '../../lib/store';
import { cn } from '../../lib/utils';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLORS = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800',
};

export function Toaster() {
  const { notifications, removeNotification } = useUIStore();
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    for (const n of notifications) {
      if (!timers.current.has(n.id)) {
        timers.current.set(
          n.id,
          setTimeout(() => {
            removeNotification(n.id);
            timers.current.delete(n.id);
          }, 5000),
        );
      }
    }
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-96 max-w-full pointer-events-none">
      {notifications.map((n) => {
        const Icon = ICONS[n.type];
        return (
          <div
            key={n.id}
            className={cn(
              'pointer-events-auto rounded-lg border shadow-sm flex items-start gap-3 p-4 animate-in slide-in-from-right-5 duration-200',
              COLORS[n.type],
            )}
          >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{n.title}</p>
              {n.message && <p className="text-xs opacity-90">{n.message}</p>}
            </div>
            <button onClick={() => removeNotification(n.id)} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
