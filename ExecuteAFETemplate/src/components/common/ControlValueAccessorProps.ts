import type { FieldErrors, FieldValues } from "react-hook-form";

export interface ControlValueAccessorProps<T extends FieldValues> {
  value: T;
  onChange: (value: T) => void;
  error?: FieldErrors<T>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  ref?: any;
}
