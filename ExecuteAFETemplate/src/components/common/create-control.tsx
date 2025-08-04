import type { ComponentType } from "react";
import { Controller } from "react-hook-form";
import type { ControlValueAccessorProps } from "./ControlValueAccessorProps";

export function CreateControl<
  // V extends FieldValues,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  T extends ControlValueAccessorProps<any>,
>(
  ValueAccessor: ComponentType<T>,
): ComponentType<{ name: string } & InferControlledProps<T>> {
  const displayName =
    ValueAccessor.displayName || ValueAccessor.name || "Component";
  const ComponentControl = ({
    name,
    ...props
  }: { name: string } & InferControlledProps<T>) => {
    return (
      <Controller
        name={name}
        render={({ field, fieldState }) => {
          return (
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            <ValueAccessor {...props} {...fieldState} {...(field as any)} />
          );
        }}
      />
    );
  };

  ComponentControl.displayName = `${displayName}Control`;

  return ComponentControl;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type InferControlledProps<T> = Omit<T, keyof ControlValueAccessorProps<any>>;
