import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
}

export default function ErrorBanner({ message, onClose }: ErrorBannerProps) {
  return (
    <div className="bg-danger-50 border border-danger-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <AlertCircle className="text-danger-600 w-5 h-5" />
        <p className="text-danger-700">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-danger-600 hover:text-danger-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
