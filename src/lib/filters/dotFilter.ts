export interface DotFilterParams {
  density: number // 0-1 (percentage coverage)
  size: number    // 2-20px radius
  spacing: number // 5-50px gap
  color: string   // hex color
}

export interface DotFilterState {
  text: string
  width: number
  height: number
  params: DotFilterParams
  image?: HTMLImageElement | null
}

export class DotFilter {
  private p5: any
  private state: DotFilterState

  constructor(p5: any, state: DotFilterState) {
    this.p5 = p5
    this.state = state
  }

  updateState(newState: Partial<DotFilterState>) {
    this.state = { ...this.state, ...newState }
  }

  render() {
    const { text, width, height, params, image } = this.state
    const { density, size, spacing, color } = params

    // Clear canvas
    this.p5.background(255)

    // Create a graphics buffer as sampling source
    const srcGraphics = this.p5.createGraphics(width, height)
    srcGraphics.background(0)

    if (image) {
      // Draw image scaled to canvas; use alpha channel for sampling
      srcGraphics.image(image, 0, 0, width, height)
    } else {
      // Draw text; use white on black then sample brightness == 255
      srcGraphics.textSize(64)
      srcGraphics.fill(255)
      srcGraphics.background(0)
      srcGraphics.textAlign(this.p5.CENTER, this.p5.CENTER)
      srcGraphics.text(text, 0, 0, width, height)
    }

    // Don't draw the graphics buffer - we only want the dots
    // this.p5.image(textGraphics, 0, 0)

    // Set up dot rendering
    this.p5.noStroke()

    // Calculate number of dots to try - much higher density
    const numDots = Math.floor(5000 * density) // Much more attempts for higher density
    
    let dotsDrawn = 0
    let attempts = 0
    const maxAttempts = Math.min(numDots * 20, 100000) // Cap max attempts for performance
    
    // Try to place dots randomly, checking if they're on text pixels (exactly like the sketch)
    while (dotsDrawn < numDots && attempts < maxAttempts) { // Prevent infinite loop
      const x = this.p5.random(width)
      const y = this.p5.random(height)
      attempts++
      
      // Sample the pixel at this position (exactly like the sketch)
      const pixel = srcGraphics.get(x, y) // [r,g,b,a]
      const alpha = pixel[3]
      const isOn = image ? (alpha > 10) : (pixel[0] === 255)
      if (isOn) {
        // Use the color from params instead of random colors
        this.p5.fill(color)
        
        // Variable dot size - base size with random variation (like the original sketch)
        const baseSize = size * 0.5 // Smaller base size
        const randomSize = this.p5.random(baseSize, baseSize * 2) // Random variation
        
        this.p5.ellipse(x, y, randomSize, randomSize)
        dotsDrawn++
      }
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Total attempts: ${attempts}, dots drawn: ${dotsDrawn}`)
    }
  }

  // Sample color from text (simplified - returns a random color for now)
  static sampleColorFromText(text: string): string {
    // Simple hash-based color generation
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 70%, 50%)`
  }
}
