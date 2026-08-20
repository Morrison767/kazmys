import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconRight?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

/** Скругления и вес шрифта — как у донора: lg-кнопка на rounded-xl, font-bold. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 disabled:bg-primary/40",
  secondary:
    "border border-border bg-card text-foreground hover:bg-muted active:bg-muted/80 disabled:text-muted-foreground",
  ghost:
    "text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted/80",
  danger:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 disabled:bg-destructive/40",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 rounded-md px-3 text-xs font-semibold",
  md: "h-10 gap-2 rounded-md px-4 text-sm font-semibold",
  lg: "h-12 gap-2 rounded-lg px-6 text-sm font-bold",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      icon: Icon,
      iconRight: IconRight,
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      type = "button",
      ...rest
    },
    ref
  ) {
    const iconSize = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-colors",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-70",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className
        )}
        {...rest}
      >
        {loading ? (
          <Loader2 className={cn(iconSize, "animate-spin")} />
        ) : (
          Icon && <Icon className={cn(iconSize, "shrink-0")} strokeWidth={2} />
        )}
        {children}
        {IconRight && !loading && (
          <IconRight className={cn(iconSize, "shrink-0")} strokeWidth={2} />
        )}
      </button>
    );
  }
);

/** Квадратная кнопка-иконка для шапки и тулбаров (паттерн донора: h-9 w-9). */
export function IconButton({
  icon: Icon,
  label,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...rest}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
