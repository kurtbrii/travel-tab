import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface FormFieldProps {
  label: string;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  min?: string;
  max?: string;
}

export function FormField({
  label,
  icon,
  type = "text",
  placeholder,
  id,
  value,
  onChange,
  onBlur,
  error,
  className,
  min,
  max,
}: FormFieldProps) {
  const reactId = useId();
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const inputId = id || `${slug}-${reactId}`;
  const errorId = `${inputId}-error`;
  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </label>
      <input
        type={type}
        className={cn(
          "mt-1 w-full rounded-lg border bg-card px-3 py-2 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px]",
          error
            ? "border-error focus-visible:ring-error/20"
            : "border-input focus-visible:border-primary focus-visible:ring-primary/20"
        )}
        placeholder={placeholder}
        value={value}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        id={inputId}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        min={min}
        max={max}
      />
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

interface PasswordFieldProps extends Omit<FormFieldProps, "type"> {
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function PasswordField({
  label,
  icon,
  placeholder,
  value,
  onChange,
  error,
  className,
  showPassword = false,
  onTogglePassword,
}: PasswordFieldProps) {
  const [internalShowPassword, setInternalShowPassword] = useState(false);
  const reactId = useId();
  const slug = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const inputId = `${slug}-${reactId}`;
  const errorId = `${inputId}-error`;

  const isPasswordVisible = onTogglePassword
    ? showPassword
    : internalShowPassword;
  const togglePassword =
    onTogglePassword || (() => setInternalShowPassword(!internalShowPassword));

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        {label}
      </label>
      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          className={cn(
            "mt-1 w-full rounded-lg border bg-card px-3 py-2 pr-10 text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:ring-[3px]",
            error
              ? "border-error focus-visible:ring-error/20"
              : "border-input focus-visible:border-primary focus-visible:ring-primary/20"
          )}
          placeholder={placeholder}
          value={value}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          id={inputId}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          onClick={togglePassword}
          className="absolute inset-y-0 right-2 grid place-items-center text-muted-foreground hover:text-foreground"
        >
          {isPasswordVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" aria-live="polite" className="mt-1 text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}
