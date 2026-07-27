import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

let memoryToasts: Toast[] = [];
const listeners = new Set<(toasts: Toast[]) => void>();

function updateToasts() {
  listeners.forEach((listener) => listener([...memoryToasts]));
}

export function toast(props: Omit<Toast, 'id'>) {
  const id = crypto.randomUUID();
  const newToast: Toast = { ...props, id };
  
  memoryToasts = [...memoryToasts, newToast];
  updateToasts();

  const duration = props.duration || 4000;
  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    updateToasts();
  }, duration);

  return id;
}

// De React hook die je route-schermen gebruiken
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(memoryToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    toast: (props: Omit<Toast, 'id'>) => toast(props),
    dismiss: (id: string) => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      updateToasts();
    },
  };
}

export function Toaster() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((t) => {
        let bgClass = 'bg-blue-50 border-blue-200 text-blue-800';
        if (t.type === 'success') bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-900';
        if (t.type === 'error') bgClass = 'bg-red-50 border-red-200 text-red-900';
        if (t.type === 'warning') bgClass = 'bg-amber-50 border-amber-200 text-amber-900';

        return (
          <div
            key={t.id}
            onClick={() => dismiss(t.id)}
            className={`p-4 rounded-2xl border shadow-lg pointer-events-auto cursor-pointer flex flex-col gap-1 transition-all duration-300 animate-in slide-in-from-top-4 ${bgClass}`}
          >
            <div className="flex justify-between items-start">
              <span className="font-black text-sm leading-snug">{t.title}</span>
              <span className="text-xs opacity-40 font-bold ml-2">×</span>
            </div>
            {t.description && (
              <p className="text-xs font-medium opacity-80 leading-normal">
                {t.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
