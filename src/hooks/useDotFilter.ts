import { useState, useCallback } from 'react'
import { DotFilterParams } from '@/lib/filters/dotFilter'

export const useDotFilter = (initialText: string = 'Hello World') => {
  const [text, setText] = useState(initialText)
  const [params, setParams] = useState<DotFilterParams>({
    density: 0.8,    // 80% coverage (higher density)
    size: 4,         // 4px base radius (smaller)
    spacing: 15,     // 15px spacing
    color: '#3B82F6' // Blue color
  })

  const updateText = useCallback((newText: string) => {
    setText(newText)
  }, [])

  const updateParams = useCallback((newParams: Partial<DotFilterParams>) => {
    setParams(prev => ({ ...prev, ...newParams }))
  }, [])

  const resetParams = useCallback(() => {
    setParams({
      density: 0.8,
      size: 4,
      spacing: 15,
      color: '#3B82F6'
    })
  }, [])

  return {
    text,
    params,
    updateText,
    updateParams,
    resetParams
  }
}