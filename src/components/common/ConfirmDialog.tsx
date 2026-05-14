import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  icon: LucideIcon;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  isLoading = false,
  loadingLabel,
  icon: Icon,
  tone = 'default',
  onConfirm,
  onCancel,
}) => {
  const isDanger = tone === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#121212] shadow-2xl shadow-black/60">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border ${
                isDanger
                  ? 'border-red-500/25 bg-red-500/10 text-red-300'
                  : 'border-[#f5c518]/35 bg-[#f5c518]/10 text-[#f5c518]'
              }`}
            >
              <Icon size={22} />
            </div>

            <div>
              <h3 id="confirm-dialog-title" className="text-xl font-bold text-white">
                {title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[#b8b8b8]">{description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/5 px-5 text-sm font-bold text-[#e6e6e6] transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-[#f5c518] text-black hover:bg-[#ddb00f]'
            }`}
          >
            {isLoading ? loadingLabel || confirmLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
