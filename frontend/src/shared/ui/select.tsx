import * as React from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils";

type SelectChangeEvent = { target: { value: string; name: string } };

interface SelectContextValue {
  value?: string;
  open: boolean;
  disabled: boolean;
  highlighted: string | null;
  triggerId: string;
  listboxId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  setOpen: (open: boolean) => void;
  setHighlighted: (value: string | null) => void;
  selectValue: (value: string) => void;
  registerItem: (value: string, label: string) => void;
  unregisterItem: (value: string) => void;
  items: { value: string; label: string }[];
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within Select");
  }
  return context;
}

function isOptionElement(
  child: React.ReactNode
): child is React.ReactElement<{ value?: string; children?: React.ReactNode; disabled?: boolean }> {
  return React.isValidElement(child) && child.type === "option";
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (event: SelectChangeEvent) => void;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
}

export function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  onChange,
  disabled = false,
  name,
  required,
  placeholder = "Select…",
  className,
  children,
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : uncontrolledValue;
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState<string | null>(null);
  const [registered, setRegistered] = React.useState<{ value: string; label: string }[]>([]);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerId = React.useId();
  const listboxId = React.useId();

  const optionChildren = React.Children.toArray(children).filter(isOptionElement);
  const isCompat = optionChildren.length > 0;

  const items = React.useMemo(() => {
    if (!isCompat) return registered;
    return optionChildren.map((child) => ({
      value: String(child.props.value ?? ""),
      label: String(child.props.children ?? ""),
    }));
  }, [isCompat, optionChildren, registered]);

  const selectValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
      onChange?.({ target: { value: next, name: name ?? "" } });
      setOpen(false);
      triggerRef.current?.focus();
    },
    [name, onChange, onValueChange, valueProp]
  );

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    setRegistered((prev) => {
      const existing = prev.find((item) => item.value === itemValue);
      if (existing?.label === label) return prev;
      if (existing) {
        return prev.map((item) => (item.value === itemValue ? { value: itemValue, label } : item));
      }
      return [...prev, { value: itemValue, label }];
    });
  }, []);

  const unregisterItem = React.useCallback((itemValue: string) => {
    setRegistered((prev) => prev.filter((item) => item.value !== itemValue));
  }, []);

  const context: SelectContextValue = {
    value,
    open,
    disabled,
    highlighted,
    triggerId,
    listboxId,
    triggerRef,
    setOpen,
    setHighlighted,
    selectValue,
    registerItem,
    unregisterItem,
    items,
  };

  return (
    <SelectContext.Provider value={context}>
      {isCompat ? (
        <div className="relative">
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {optionChildren.map((child) => (
              <SelectItem
                key={String(child.props.value)}
                value={String(child.props.value ?? "")}
                disabled={child.props.disabled}
              >
                {child.props.children}
              </SelectItem>
            ))}
          </SelectContent>
        </div>
      ) : (
        children
      )}
      {name ? <input type="hidden" name={name} value={value ?? ""} required={required} /> : null}
    </SelectContext.Provider>
  );
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { open, disabled, setOpen, setHighlighted, value, items, triggerRef, triggerId, listboxId } =
    useSelectContext();

  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);

  return (
    <button
      type="button"
      id={triggerId}
      ref={triggerRef}
      role="combobox"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-haspopup="listbox"
      disabled={disabled}
      {...props}
      onClick={() => {
        if (disabled) return;
        setOpen(!open);
      }}
      onKeyDown={(event) => {
        if (disabled || open) return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setHighlighted(items.find((item) => item.value === value)?.value ?? items[0]?.value ?? null);
          setOpen(true);
        }
      }}
      className={cn(
        "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-left text-base sm:text-sm text-slate-900 shadow-xs ring-offset-white transition-all",
        "hover:bg-slate-50/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lima-500 focus-visible:border-lima-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        open && "border-lima-500 ring-2 ring-lima-500",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
      />
    </button>
  );
});
SelectTrigger.displayName = "SelectTrigger";

export function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value, items } = useSelectContext();
  const selected = items.find((item) => item.value === value);

  return (
    <span className={cn("min-w-0 truncate", selected ? "text-slate-900" : "text-slate-400", className)}>
      {selected?.label || placeholder || "Select…"}
    </span>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const {
    open,
    setOpen,
    value,
    items,
    highlighted,
    setHighlighted,
    selectValue,
    triggerRef,
    triggerId,
    listboxId,
  } = useSelectContext();
  const listRef = React.useRef<HTMLDivElement>(null);
  const [coords, setCoords] = React.useState<{
    top?: number;
    bottom?: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const maxMenu = 280;
    const spaceBelow = window.innerHeight - rect.bottom - gap - 8;
    const spaceAbove = rect.top - gap - 8;
    const openUp = spaceBelow < 140 && spaceAbove > spaceBelow;

    setCoords({
      top: openUp ? undefined : rect.bottom + gap,
      bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
      left: rect.left,
      width: rect.width,
      maxHeight: Math.max(120, Math.min(maxMenu, openUp ? spaceAbove : spaceBelow)),
    });
  }, [triggerRef]);

  React.useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    const onReposition = () => updatePosition();
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open, updatePosition]);

  const itemsRef = React.useRef(items);
  const selectedRef = React.useRef(value);
  itemsRef.current = items;
  selectedRef.current = value;

  React.useEffect(() => {
    if (!open) return;
    const list = itemsRef.current;
    setHighlighted(list.find((item) => item.value === selectedRef.current)?.value ?? list[0]?.value ?? null);
  }, [open, setHighlighted]);

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!items.length) return;
        const currentIndex = items.findIndex((item) => item.value === highlighted);
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex + direction + items.length) % items.length;
        setHighlighted(items[nextIndex].value);
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        if (items[0]) setHighlighted(items[0].value);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        if (items[items.length - 1]) setHighlighted(items[items.length - 1].value);
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (highlighted) selectValue(highlighted);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [highlighted, items, open, selectValue, setHighlighted, setOpen, triggerRef]);

  React.useEffect(() => {
    if (!open || !highlighted || !listRef.current) return;
    const active = listRef.current.querySelector<HTMLElement>(`[data-value="${CSS.escape(highlighted)}"]`);
    active?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  if (typeof document === "undefined") return null;

  const visible = open && coords;

  return createPortal(
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-labelledby={triggerId}
      hidden={!visible}
      style={
        visible
          ? {
              position: "fixed",
              top: coords.top,
              bottom: coords.bottom,
              left: coords.left,
              width: coords.width,
              maxHeight: coords.maxHeight,
            }
          : undefined
      }
      className={cn(
        "z-[80] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg",
        !visible && "hidden",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
}

export function SelectItem({
  value,
  children,
  disabled,
  className,
}: {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const {
    value: selected,
    highlighted,
    setHighlighted,
    selectValue,
    registerItem,
    unregisterItem,
  } = useSelectContext();
  const label = typeof children === "string" ? children : String(children);
  const isSelected = selected === value;
  const isHighlighted = highlighted === value;

  React.useEffect(() => {
    registerItem(value, label);
    return () => unregisterItem(value);
  }, [label, registerItem, unregisterItem, value]);

  return (
    <div
      role="option"
      data-value={value}
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      onMouseEnter={() => {
        if (!disabled) setHighlighted(value);
      }}
      onClick={() => {
        if (!disabled) selectValue(value);
      }}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm text-slate-700 outline-none transition-colors",
        isHighlighted && "bg-lima-50 text-emerald-950",
        isSelected && "font-semibold text-emerald-900",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      {isSelected ? (
        <Check className="absolute left-2 h-4 w-4 text-lima-600" />
      ) : null}
      <span className="truncate">{children}</span>
    </div>
  );
}
