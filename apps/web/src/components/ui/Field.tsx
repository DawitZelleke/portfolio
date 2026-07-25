import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type FieldWrapProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
};

export function FieldWrap({ label, htmlFor, error, hint, children }: FieldWrapProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-sm text-ink-faint">{hint}</p>}
      {error && (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldCls =
  'w-full rounded-field border border-line-strong bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-faint transition-colors duration-fast focus:border-accent-bright focus:outline-none aria-[invalid=true]:border-danger';

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldCls} ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea rows={5} {...props} className={`${fieldCls} resize-y ${props.className ?? ''}`} />
  );
}
