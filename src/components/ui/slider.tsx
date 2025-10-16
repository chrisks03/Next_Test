import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(e.target.value)]
      onValueChange?.(newValue)
    }

    return (
      <input
        type="range"
        ref={ref}
        value={value[0] || 0}
        onChange={handleChange}
        className={cn(
          "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider",
          className
        )}
        style={{
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${((value[0] - (props.min || 0)) / ((props.max || 100) - (props.min || 0))) * 100}%, hsl(var(--secondary)) ${((value[0] - (props.min || 0)) / ((props.max || 100) - (props.min || 0))) * 100}%, hsl(var(--secondary)) 100%)`
        }}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }