import { CheckCircle, X } from 'lucide-react';

interface SuccessBannerProps {
  message: string;
  onClose?: () => void;
}

export default function SuccessBanner({ message, onClose }: SuccessBannerProps) {
  return (
    <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <CheckCircle className="text-success-600 w-5 h-5" />
        <p className="text-success-700">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-success-600 hover:text-success-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
