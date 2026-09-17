import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<"input">, "type"> & {
  children: ReactNode;
  error?: string;
};

/** Casilla con su texto. El label envuelve al input, así un clic en el texto la marca. */
export function Checkbox({ children, error, className, ...props }: Props) {
  const idError = useId();
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="flex items-start gap-2.5 text-sm text-tinta">
        <input
          type="checkbox"
          className="mt-0.5 size-4 shrink-0 accent-bordo"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          {...props}
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={idError} className="text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
