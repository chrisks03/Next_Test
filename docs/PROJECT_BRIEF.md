Generative Tool Boilerplate - Product Requirements Document
Project Overview
Build a modular Next.js boilerplate for creating custom generative design tools. Each deployment becomes a standalone tool for clients to generate branded visual assets independently.
Technical Stack

Framework: Next.js 14+ with TypeScript (strict mode)
Graphics: p5.js for generative rendering
UI: shadcn/ui components
Deployment: Vercel
Styling: Tailwind CSS

MVP Features
1. Text Input System

Single text input field
Renders text to p5 canvas for filter processing
Default font: Sans-serif, adjustable size
Text centered on canvas

2. Dot Filter Implementation
Parameters (with suggested ranges):

Density: 10-90% coverage
Size: 2-20px radius
Spacing: 5-50px gap
Color: Sampled from source text

3. Animation System

Linear interpolation between start/end parameter values
Duration: 5-second loops
Each parameter can animate independently
Timeline scrubber for preview
Export triggers full animation render

4. Canvas Management

Responsive sizing: fills viewport minus UI (max 100vh)
Aspect ratio presets: 1:1, 9:16, 16:9
Live rescaling when ratio changes (maintains work)
Canvas updates on parameter change (debounced 100ms)

5. Export Functionality

PNG: Current frame at canvas resolution
GIF: Full animation loop (using gif.js or similar)
Client-side generation, no server processing

UI Layout
[Sidebar (250px)]  [Canvas (remaining space)]
- Title
- Text Input
- Filter Controls
  - Density slider
  - Size slider  
  - Spacing slider
- Animation Controls
  - Duration
  - Start/End values
- Export Section
  - Aspect ratio selector
  - Export PNG button
  - Export GIF button
```

## Architecture Guidelines

### File Structure
```
/components
  /ui (shadcn components)
  /canvas
    P5Wrapper.tsx
    DotFilter.ts
  /controls
    ParameterSlider.tsx
    ExportControls.tsx
/lib
  /filters
    dotFilter.ts
  /animation
    interpolation.ts
  /export
    exportHandlers.ts
/hooks
  useP5.ts
  useAnimation.ts
State Management

React state for UI parameters
Pass parameters to p5 sketch via props
Debounce canvas updates for performance

P5.js Integration
typescript// Dynamic import to avoid SSR issues
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false })
Key Performance Considerations

Use noLoop() when static, loop() only during animation
Implement frameRate(30) for consistent performance
Debounce parameter changes
Limit canvas size to 2000x2000 max for exports

Development Phases
Phase 1: Core Setup ✅ Start Here

Next.js + TypeScript + Tailwind setup
Basic p5.js integration with dynamic import
Simple canvas rendering

Phase 2: Dot Filter

Implement basic dot grid
Add parameter controls
Color sampling from text

Phase 3: UI Controls

shadcn/ui sidebar
Parameter sliders
Aspect ratio switcher

Phase 4: Animation

Parameter interpolation
Timeline controls
Preview scrubbing

Phase 5: Export

PNG export via canvas.toDataURL()
GIF export with gif.js library

Code Generation Instructions for Cursor
Start with this prompt:
"Create a Next.js 14 app with TypeScript, Tailwind, and shadcn/ui. Add p5.js with a dynamic import wrapper component. Create a responsive layout with a 250px sidebar and canvas that fills remaining space."
Then iterate:
"Add a dot filter function that converts text to a dot pattern. Include parameters for density (percentage), size (pixels), and spacing (pixels)."
Success Criteria

Text renders with dot filter applied
Sliders smoothly update visualization
Canvas maintains aspect ratio when resized
Exports work reliably
No performance issues with default settings