import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (color: string) => void
}

export default function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="color-picker">{label}</Label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={handleColorChange}
          className="w-10 h-10 border border-input rounded-md cursor-pointer bg-transparent"
        />
        <Input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  )
}