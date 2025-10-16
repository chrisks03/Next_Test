'use client'

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DotFilter, DotFilterParams, DotFilterState } from '@/lib/filters/dotFilter'

interface P5WrapperProps {
  text: string
  width: number
  height: number
  params: DotFilterParams
  onReady?: (handle: P5WrapperHandle) => void
}

export type P5WrapperHandle = {
  toDataURL: (type?: string, quality?: number) => string | null
  getCanvas: () => HTMLCanvasElement | null
  renderWithParams: (newParams: DotFilterParams) => void
}

function P5WrapperInner({ text, width, height, params, onReady }: P5WrapperProps, ref: React.Ref<P5WrapperHandle>) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<any>(null)
  const dotFilterRef = useRef<DotFilter | null>(null)
  const [p5, setP5] = useState<any>(null)
  const canvasElRef = useRef<HTMLCanvasElement | null>(null)

  const imperativeHandle: P5WrapperHandle = {
    toDataURL: (type?: string, quality?: number) => {
      const canvasEl: HTMLCanvasElement | null = canvasElRef.current
      if (!canvasEl) return null
      try {
        return canvasEl.toDataURL(type, quality)
      } catch {
        return null
      }
    },
    getCanvas: () => {
      return canvasElRef.current
    },
    renderWithParams: (newParams: DotFilterParams) => {
      if (!dotFilterRef.current) return
      dotFilterRef.current.updateState({ text, width, height, params: newParams })
      dotFilterRef.current.render()
    },
  }

  useImperativeHandle(ref, () => imperativeHandle, [text, width, height])

  // Expose handle via callback for environments where ref forwarding is not supported by wrappers
  useEffect(() => {
    onReady?.(imperativeHandle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady])

  useEffect(() => {
    // Dynamically import p5
    import('p5').then((p5Module: any) => {
      setP5(() => p5Module.default)
    })
  }, [])

  useEffect(() => {
    if (!p5 || !canvasRef.current) return

    // Clean up existing instance
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove()
    }

    // Create new p5 instance
    const sketch = (p: any) => {
      p.setup = () => {
        const renderer = p.createCanvas(width, height)
        renderer.parent(canvasRef.current)
        // Capture HTMLCanvasElement from renderer or instance
        // p5 returns a renderer with .elt; instance may expose .canvas or _renderer.canvas
        // Prefer renderer.elt when available
        const candidate = (renderer as any)?.elt || (renderer as any)?.canvas || (p as any)?.canvas || (p as any)?._renderer?.canvas || null
        canvasElRef.current = (candidate as HTMLCanvasElement) ?? null
        
        // Initialize dot filter
        const state: DotFilterState = {
          text,
          width,
          height,
          params
        }
        dotFilterRef.current = new DotFilter(p, state)
        
        // Render with dot filter
        dotFilterRef.current.render()
      }

      p.draw = () => {
        // Allow external triggers to redraw; by default don't loop to save CPU
        p.noLoop()
      }

      p.windowResized = () => {
        p.resizeCanvas(width, height)
        // Update HTMLCanvasElement reference after resize
        const candidate = (p as any)?.canvas || (p as any)?._renderer?.canvas || null
        canvasElRef.current = (candidate as HTMLCanvasElement) ?? canvasElRef.current
        if (dotFilterRef.current) {
          dotFilterRef.current.updateState({ text, width, height, params })
          dotFilterRef.current.render()
        }
      }
    }

    p5InstanceRef.current = new p5(sketch)

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
      }
    }
  }, [p5, text, width, height, params])

  // Update dot filter when params change with debouncing for performance
  useEffect(() => {
    if (dotFilterRef.current) {
      // Debounce parameter changes to reduce lag
      const timeoutId = setTimeout(() => {
        if (dotFilterRef.current) {
          dotFilterRef.current.updateState({ text, width, height, params })
          dotFilterRef.current.render()
        }
      }, 100) // 100ms debounce

      return () => clearTimeout(timeoutId)
    }
  }, [text, width, height, params])

  return <div ref={canvasRef} />
}

const P5Wrapper = forwardRef<P5WrapperHandle, P5WrapperProps>(P5WrapperInner)
export default P5Wrapper
