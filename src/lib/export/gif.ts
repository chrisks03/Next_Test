export async function loadGifJs(): Promise<any> {
  if (typeof window === 'undefined') return null
  if ((window as any).GIF) return (window as any).GIF

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/gif.js.optimized/dist/gif.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load gif.js'))
    document.body.appendChild(script)
  })

  return (window as any).GIF || null
}

export async function exportCanvasToGif(opts: {
  canvas: HTMLCanvasElement,
  durationMs: number,
  fps?: number,
  onProgress?: (p: number) => void,
  renderFrame?: (t: number) => void,
}): Promise<Blob> {
  const GIF = await loadGifJs()
  if (!GIF) throw new Error('gif.js not available')

  const { canvas, durationMs, fps = 20, onProgress, renderFrame } = opts
  const totalFrames = Math.max(1, Math.round((durationMs / 1000) * fps))
  const delay = Math.round(1000 / fps)

  return new Promise<Blob>((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality: 10,
      workerScript: 'https://unpkg.com/gif.js.optimized/dist/gif.worker.js',
      width: canvas.width,
      height: canvas.height,
    })

    gif.on('progress', (p: number) => onProgress?.(p))
    gif.on('finished', (blob: Blob) => resolve(blob))
    gif.on('abort', () => reject(new Error('GIF export aborted')))

    // Capture frames by drawing current canvas onto an offscreen canvas
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const ctx = off.getContext('2d')!

    for (let i = 0; i < totalFrames; i++) {
      ctx.clearRect(0, 0, off.width, off.height)
      if (renderFrame) {
        const t = i / totalFrames
        try { renderFrame(t) } catch (e) { /* ignore frame errors to continue */ }
      }
      ctx.drawImage(canvas, 0, 0)
      gif.addFrame(off, { copy: true, delay })
    }

    gif.render()
  })
}


