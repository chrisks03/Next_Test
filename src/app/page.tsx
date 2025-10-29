'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useDotFilter } from '@/hooks/useDotFilter'
import { useAnimation } from '@/hooks/useAnimation'
import { interpolateParams, interpolateColor, linear, easeInOutCubic, easeInQuad, easeOutQuad } from '@/lib/animation/interpolation'
import ParameterSlider from '@/components/controls/ParameterSlider'
import ColorPicker from '@/components/controls/ColorPicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCcw, Square, Monitor, Smartphone, Download } from 'lucide-react'

// Dynamic import to avoid SSR issues with p5.js
import type { P5WrapperHandle } from '@/components/canvas/P5Wrapper'
import { exportCanvasToGif } from '@/lib/export/gif'
const P5Wrapper = dynamic(() => import('@/components/canvas/P5Wrapper'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading canvas...</div>
})

const ASPECT_RATIOS = {
  '1:1': { width: 600, height: 600, label: 'Square', icon: Square },
  '16:9': { width: 800, height: 450, label: 'Landscape', icon: Monitor },
  '9:16': { width: 450, height: 800, label: 'Portrait', icon: Smartphone },
}

export default function Home() {
  const { text, params, updateText, updateParams, resetParams } = useDotFilter('Mycelium')
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  const [selectedRatio, setSelectedRatio] = useState<'1:1' | '16:9' | '9:16' | 'Custom'>('16:9')
  const { isPlaying, durationMs, progress, play, pause, stop, setDurationMs, setScrub } = useAnimation(5000)
  const [easingName, setEasingName] = useState<'linear' | 'easeInOutCubic' | 'easeInQuad' | 'easeOutQuad'>('easeInOutCubic')
  const easingFn = useMemo(() => {
    switch (easingName) {
      case 'linear': return linear
      case 'easeInQuad': return easeInQuad
      case 'easeOutQuad': return easeOutQuad
      default: return easeInOutCubic
    }
  }, [easingName])

  // Animation start/end values for numeric params
  const [animStart, setAnimStart] = useState({ density: 0.6, size: 4, spacing: 15, color: '#035408' })
  const [animEnd, setAnimEnd] = useState({ density: 1.0, size: 10, spacing: 30, color: '#5c3600' })

  const handleAspectRatioChange = (ratio: '1:1' | '16:9' | '9:16' | 'Custom') => {
    setSelectedRatio(ratio)
    if (ratio !== 'Custom') {
      const newSize = ASPECT_RATIOS[ratio]
      setCanvasSize({ width: newSize.width, height: newSize.height })
    }
  }

  // Compute animated params based on progress; color comes from current params
  const animatedParams = useMemo(() => {
    const { density, size, spacing } = interpolateParams(
      { density: animStart.density, size: animStart.size, spacing: animStart.spacing },
      { density: animEnd.density, size: animEnd.size, spacing: animEnd.spacing },
      progress,
      easingFn
    )
    const color = interpolateColor(animStart.color, animEnd.color, progress, easingFn)
    return { density, size, spacing, color }
  }, [animStart, animEnd, progress, easingFn])

  const canvasRef = useRef<P5WrapperHandle | null>(null)

  const handleExportPNG = () => {
    // Ensure current visible frame is rendered before capture
    const currentParams = isPlaying ? animatedParams : params
    canvasRef.current?.renderWithParams(currentParams)
    const dataUrl = canvasRef.current?.toDataURL('image/png')
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `dot-filter-${canvasSize.width}x${canvasSize.height}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const handleExportGIF = async () => {
    const canvas = canvasRef.current?.getCanvas()
    if (!canvas) return
    // Render each frame deterministically and capture
    const fps = 20
    const totalFrames = Math.max(1, Math.round((durationMs / 1000) * fps))
    const blob = await exportCanvasToGif({
      canvas,
      durationMs,
      fps,
      renderFrame: (t) => {
        const { density, size, spacing } = interpolateParams(
          { density: animStart.density, size: animStart.size, spacing: animStart.spacing },
          { density: animEnd.density, size: animEnd.size, spacing: animEnd.spacing },
          t,
          easingFn
        )
        const color = interpolateColor(animStart.color, animEnd.color, t, easingFn)
        canvasRef.current?.renderWithParams({ density, size, spacing, color })
      }
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dot-filter-${canvasSize.width}x${canvasSize.height}.gif`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const [sidebarVisible, setSidebarVisible] = useState(true)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setSidebarVisible(v => !v)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      {/* Sidebar */}
      {sidebarVisible && (
        <div className="order-2 md:order-1 w-full md:w-80 min-w-[320px] shrink-0 p-6 flex flex-col overflow-y-auto no-scrollbar space-y-6 bg-transparent">
        
        {/* Text Input Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Text Input</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="text-input">Enter your text</Label>
              <Input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => updateText(e.target.value)}
                placeholder="Enter text..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Aspect Ratio Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Aspect Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(ASPECT_RATIOS).map(([ratio, config]) => {
                const Icon = config.icon
                return (
                  <Button
                    key={ratio}
                    variant={selectedRatio === ratio ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleAspectRatioChange(ratio as '1:1' | '16:9' | '9:16')}
                    className="flex flex-col items-center space-y-1 h-auto py-3"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{config.label}</span>
                    <span className="text-xs text-muted-foreground">{ratio}</span>
                  </Button>
                )
              })}
              <Button
                key={'Custom'}
                variant={selectedRatio === 'Custom' ? "default" : "outline"}
                size="sm"
                onClick={() => handleAspectRatioChange('Custom')}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Monitor className="w-4 h-4" />
                <span className="text-xs">Custom</span>
                <span className="text-xs text-muted-foreground">W×H</span>
              </Button>
            </div>
            {selectedRatio === 'Custom' && (
              <div className="mt-3 text-xs text-muted-foreground">
                Set your custom width and height below in Canvas Size.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Canvas Size Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Canvas Size</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={canvasSize.width}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={canvasSize.height}
                  onChange={(e) => setCanvasSize(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dot Filter Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Dot Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ParameterSlider
              label="Density"
              value={params.density}
              min={0.1}
              max={1}
              step={0.1}
              onChange={(value) => updateParams({ density: value })}
              unit="%"
              displayValue={`${Math.round(params.density * 100)}%`}
            />

            <ParameterSlider
              label="Size"
              value={params.size}
              min={2}
              max={20}
              step={1}
              onChange={(value) => updateParams({ size: value })}
              unit="px"
            />

            <ParameterSlider
              label="Spacing"
              value={params.spacing}
              min={5}
              max={50}
              step={1}
              onChange={(value) => updateParams({ spacing: value })}
              unit="px"
            />

            <ColorPicker
              label="Color"
              value={params.color}
              onChange={(color) => updateParams({ color })}
            />

            <Button
              onClick={resetParams}
              variant="outline"
              className="w-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Parameters
            </Button>
          </CardContent>
        </Card>

        {/* Animation Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle className="font-medium">Animation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={isPlaying ? 'default' : 'outline'}
                onClick={isPlaying ? pause : play}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <div className="flex items-center gap-2 ml-auto">
                <Label htmlFor="duration">Duration (ms)</Label>
                <Input id="duration" type="number" value={durationMs} onChange={(e) => setDurationMs(Math.max(500, parseInt(e.target.value) || 1000))} className="w-28" />
              </div>
            </div>

            {/* Easing selection */}
            <div className="flex items-center gap-2 flex-wrap">
              <Label htmlFor="easing">Easing</Label>
              <select id="easing" className="border border-input rounded px-2 py-1 text-sm" value={easingName} onChange={(e) => setEasingName(e.target.value as any)}>
                <option value="linear">Linear</option>
                <option value="easeInOutCubic">Ease In Out Cubic</option>
                <option value="easeInQuad">Ease In Quad</option>
                <option value="easeOutQuad">Ease Out Quad</option>
              </select>
            </div>

            {/* Scrubber */}
            <div className="space-y-1">
              <Label htmlFor="scrub">Timeline</Label>
              <input id="scrub" type="range" min={0} max={100} value={Math.round(progress * 100)} onChange={(e) => setScrub((parseInt(e.target.value) || 0) / 100)} className="w-full" />
            </div>

            {/* Start/End parameter controls */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="text-sm font-medium">Start</div>
                <ParameterSlider label="Density" value={animStart.density} min={0.1} max={1} step={0.1} onChange={(v) => setAnimStart(s => ({ ...s, density: v }))} unit="%" displayValue={`${Math.round(animStart.density * 100)}%`} />
                <ParameterSlider label="Size" value={animStart.size} min={2} max={20} step={1} onChange={(v) => setAnimStart(s => ({ ...s, size: v }))} unit="px" />
                <ParameterSlider label="Spacing" value={animStart.spacing} min={5} max={50} step={1} onChange={(v) => setAnimStart(s => ({ ...s, spacing: v }))} unit="px" />
                <ColorPicker label="Color" value={animStart.color} onChange={(c) => setAnimStart(s => ({ ...s, color: c }))} />
              </div>
              <div className="space-y-4">
                <div className="text-sm font-medium">End</div>
                <ParameterSlider label="Density" value={animEnd.density} min={0.1} max={1} step={0.1} onChange={(v) => setAnimEnd(s => ({ ...s, density: v }))} unit="%" displayValue={`${Math.round(animEnd.density * 100)}%`} />
                <ParameterSlider label="Size" value={animEnd.size} min={2} max={20} step={1} onChange={(v) => setAnimEnd(s => ({ ...s, size: v }))} unit="px" />
                <ParameterSlider label="Spacing" value={animEnd.spacing} min={5} max={50} step={1} onChange={(v) => setAnimEnd(s => ({ ...s, spacing: v }))} unit="px" />
                <ColorPicker label="Color" value={animEnd.color} onChange={(c) => setAnimEnd(s => ({ ...s, color: c }))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Controls moved to floating overlay */}
        </div>
      )}

      {/* Canvas Area */}
      <div className="order-1 md:order-2 flex-1 flex items-center justify-center p-6 bg-muted/20">
        <div className="relative border-2 border-border rounded-lg overflow-hidden shadow-lg">
          <P5Wrapper 
            text={text}
            width={canvasSize.width}
            height={canvasSize.height}
            params={isPlaying ? animatedParams : params}
            ref={canvasRef as any}
            onReady={(h) => { canvasRef.current = h }}
          />
        </div>
      </div>
      {/* Viewport-floating export controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button size="sm" variant="default" onClick={handleExportPNG}>
          <Download className="w-4 h-4 mr-2" /> PNG
        </Button>
        <Button size="sm" variant="outline" onClick={handleExportGIF}>
          <Download className="w-4 h-4 mr-2" /> GIF
        </Button>
      </div>
      {/* Viewport-floating UI visibility toggle */}
      <div className="fixed top-4 left-4 z-50">
        <Button size="sm" variant="outline" onClick={() => setSidebarVisible(v => !v)}>
          Hide (H)
        </Button>
      </div>
    </div>
  )
}