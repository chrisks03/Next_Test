import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface ParameterSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  unit?: string
  displayValue?: string
}

export default function ParameterSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = '',
  displayValue
}: ParameterSliderProps) {
  const handleValueChange = (values: number[]) => {
    onChange(values[0])
  }

  const display = displayValue || `${value}${unit}`

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>{label}</Label>
        <span className="text-sm text-muted-foreground">{display}</span>
      </div>
      <Slider
        id={label.toLowerCase().replace(/\s+/g, '-')}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleValueChange}
        className="w-full"
      />
    </div>
  )
}