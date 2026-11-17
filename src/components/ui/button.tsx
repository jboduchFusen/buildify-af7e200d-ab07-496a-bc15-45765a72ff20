
import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? (props.children as React.ReactElement).type : "button";
    const childProps = asChild ? { ...props, ...((props.children as React.ReactElement).props || {}) } : props;
    
    return (
      <Comp
        className={`btn ${variant === 'default' ? 'btn-primary' : 
                         variant === 'destructive' ? 'btn-destructive' : 
                         variant === 'outline' ? 'btn-outline' : 
                         variant === 'secondary' ? 'btn-secondary' : 
                         variant === 'ghost' ? 'btn-ghost' : 
                         variant === 'link' ? 'btn-link' : ''} 
                  ${size === 'sm' ? 'btn-sm' : 
                    size === 'lg' ? 'btn-lg' : 
                    size === 'icon' ? 'btn-icon' : ''} 
                  ${className || ''}`}
        ref={ref}
        {...childProps}
      />
    )
  }
)
Button.displayName = "Button"

const buttonVariants = (_opts?: { variant?: ButtonProps['variant']; size?: ButtonProps['size'] }) => "btn";

export { Button, buttonVariants }