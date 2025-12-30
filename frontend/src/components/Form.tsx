import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
}

export function FormField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-danger-600">*</span>}
      </label>
      {children || (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input ${error ? 'border-danger-500 focus:ring-danger-500' : ''}`}
        />
      )}
      {error && <p className="text-danger-600 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormProps {
  onSubmit: (data: Record<string, unknown>) => void;
  children: ReactNode;
  loading?: boolean;
}

export function Form({ onSubmit, children, loading = false }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({});
  };

  return (
    <form onSubmit={handleSubmit}>
      {children}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
