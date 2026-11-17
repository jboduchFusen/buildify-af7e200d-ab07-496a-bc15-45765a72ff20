
import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

interface SelectProps extends React.ComponentPropsWithoutRef<"div"> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ children, value, onValueChange, ...props }: SelectProps) => {
  return (
    <div className="select-wrapper" {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            value,
            onValueChange
          });
        }
        return child;
      })}
    </div>
  );
};

interface SelectTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, id, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    
    return (
      <>
        <button
          ref={ref}
          id={id}
          type="button"
          className={`form-select ${className || ''}`}
          onClick={() => setOpen(!open)}
          aria-haspopup="listbox"
          aria-expanded={open}
          {...props}
        >
          {children}
          <ChevronDown className="select-icon" />
        </button>
        {open && (
          <SelectContent onSelect={(value) => {
            if (props.onValueChange) {
              props.onValueChange(value);
            }
            setOpen(false);
          }} />
        )}
      </>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectValueProps {
  placeholder?: string;
  children?: React.ReactNode;
}

const SelectValue = ({ placeholder, children }: SelectValueProps) => {
  return <span>{children || placeholder}</span>;
};

interface SelectContentProps {
  onSelect: (value: string) => void;
  children?: React.ReactNode;
}

const SelectContent = ({ children, onSelect }: SelectContentProps) => {
  // Find all SelectItem children and pass the onSelect handler
  return (
    <div className="select-content">
      <ul className="select-items">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onSelect
            });
          }
          return child;
        })}
      </ul>
    </div>
  );
};

interface SelectItemProps extends Omit<React.ComponentPropsWithoutRef<"li">, "onSelect"> {
  value: string;
  onSelect?: (value: string) => void;
}

const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, onSelect, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={`select-item ${className || ''}`}
        onClick={() => onSelect && onSelect(value)}
        role="option"
        data-value={value}
        {...props}
      >
        {children}
      </li>
    );
  }
);
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
}