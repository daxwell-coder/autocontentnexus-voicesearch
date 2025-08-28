import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({ isOpen: false, setIsOpen: () => {} });

const Select: React.FC<SelectProps> = ({ value, onValueChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext);
    
    return (
      <button
        type="button"
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);

SelectTrigger.displayName = "SelectTrigger";

const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const { value } = React.useContext(SelectContext);
  
  return (
    <span className={cn("block truncate", !value && "text-muted-foreground")}>
      {value || placeholder}
    </span>
  );
};

const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const { isOpen } = React.useContext(SelectContext);
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

const SelectItem: React.FC<SelectItemProps> = ({ value, children }) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);
  
  const handleSelect = () => {
    onValueChange?.(value);
    setIsOpen(false);
  };
  
  return (
    <div
      className="relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100"
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
export type { SelectProps, SelectTriggerProps, SelectValueProps, SelectContentProps, SelectItemProps };
