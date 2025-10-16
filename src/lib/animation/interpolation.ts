export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(Math.max(value, min), max)
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function linear(t: number): number {
  return t
}

export function easeInQuad(t: number): number {
  return t * t
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function interpolateParams<T extends Record<string, number>>(
  start: T,
  end: T,
  t: number,
  easing: (t: number) => number = easeInOutCubic
): T {
  const eased = clamp(easing(clamp(t, 0, 1)), 0, 1)
  const out: Record<string, number> = {}
  for (const key of Object.keys(start)) {
    const s = start[key]
    const e = end[key]
    out[key] = lerp(s, e, eased)
  }
  return out as T
}

// Color helpers
type RGB = { r: number; g: number; b: number }

export function hexToRgb(hex: string): RGB {
  const normalized = hex.replace('#', '')
  const full = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized
  const num = parseInt(full, 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255
  return { r, g, b }
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function interpolateColor(startHex: string, endHex: string, t: number, easing: (t: number) => number = easeInOutCubic): string {
  const s = hexToRgb(startHex)
  const e = hexToRgb(endHex)
  const eased = clamp(easing(clamp(t, 0, 1)), 0, 1)
  return rgbToHex({
    r: lerp(s.r, e.r, eased),
    g: lerp(s.g, e.g, eased),
    b: lerp(s.b, e.b, eased),
  })
}


