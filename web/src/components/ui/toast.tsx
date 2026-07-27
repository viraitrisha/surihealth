import { useToast, type ToastType } from '#/hooks/use-toast';
import { CircleCheckBig, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';

const toastStyles: Record<ToastType, { bg: string; border: string; text: string; icon: any }> = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: CircleCheckBig,
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: CircleAlert,
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-800',
    icon: TriangleAlert,
  },
};

export function ToastProvider() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div 
      dir="ltr"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        const type = t.type || 'info';
        const styles = toastStyles[type];
        const Icon = styles.icon;

        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border ${styles.bg} ${styles.border} ${styles.text} shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-5`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-base leading-tight tracking-tight">{t.title}</p>
              {t.description && (
                <p className="text-sm mt-1 opacity-90 leading-snug">{t.description}</p>
              )}
            </div>
            
            <button
              onClick={() => dismiss(t.id)}
              className="text-current opacity-50 hover:opacity-100 p-0.5 rounded-lg hover:bg-black/5 transition-all focus:outline-none"
              aria-label="Sluiten"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
