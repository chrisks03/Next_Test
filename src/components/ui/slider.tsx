import * as React from "react"
import { cn } from "@/lib/utils"

type SliderInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">

interface SliderProps extends SliderInputProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value = [0], onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseFloat(e.target.value)]
      onValueChange?.(newValue)
    }

    // Coerce possibly string min/max props into numbers for arithmetic
    const numericMin = typeof props.min === "number" ? props.min : props.min != null ? parseFloat(String(props.min)) : 0
    const numericMax = typeof props.max === "number" ? props.max : props.max != null ? parseFloat(String(props.max)) : 100
    const currentValue = typeof value?.[0] === "number" ? value[0] : parseFloat(String(value?.[0] ?? 0))
    const clampedValue = Math.min(Math.max(currentValue, numericMin), numericMax)
    const range = numericMax - numericMin || 1
    const percent = ((clampedValue - numericMin) / range) * 100

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
          background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percent}%, hsl(var(--secondary)) ${percent}%, hsl(var(--secondary)) 100%)`
        }}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }