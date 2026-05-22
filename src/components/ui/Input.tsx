import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

// ── Shared wrapper ───────────────────────────

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

function FieldWrapper({
  label,
  error,
  hint,
  required,
  children,
  className = "",
}: FieldWrapperProps) {
  return (
    <div className={["flex flex-col gap-1.5", className].join(" ")}>
      {label && (
        <label className="text-sm font-semibold text-gray-300">
          {label}
          {required && <span className="text-yellow-400 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          ⚠ {error}
        </p>
      )}
      {!error && hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

// ── Input ────────────────────────────────────

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({
  label,
  error,
  hint,
  prefix,
  suffix,
  required,
  className = "",
  ...props
}: InputProps) {
  const inputBase = [
    "w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600",
    "outline-none transition-all duration-200",
    "focus:bg-white/8 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20",
    error ? "border-red-500/50" : "border-white/10 hover:border-white/20",
  ].join(" ");

  return (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-sm text-gray-400 flex items-center pointer-events-none select-none">
            {prefix}
          </div>
        )}
        <input
          className={[
            inputBase,
            prefix ? "pl-10" : "",
            suffix ? "pr-10" : "",
          ].join(" ")}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 text-sm text-gray-400 flex items-center">
            {suffix}
          </div>
        )}
      </div>
    </FieldWrapper>
  );
}

// ── Select ───────────────────────────────────

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  required,
  className = "",
  ...props
}: SelectProps) {
  return (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <select
        className={[
          "w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white",
          "outline-none transition-all duration-200",
          "focus:bg-white/8 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20",
          "appearance-none cursor-pointer",
          error ? "border-red-500/50" : "border-white/10 hover:border-white/20",
          "[&>option]:bg-[#1a0a2e] [&>option]:text-white",
        ].join(" ")}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

// ── Textarea ─────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  required,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <FieldWrapper
      label={label}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <textarea
        className={[
          "w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600",
          "outline-none transition-all duration-200 resize-none",
          "focus:bg-white/8 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20",
          error ? "border-red-500/50" : "border-white/10 hover:border-white/20",
          className,
        ].join(" ")}
        {...props}
      />
    </FieldWrapper>
  );
}
