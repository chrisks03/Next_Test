import { useCallback, useEffect, useRef, useState } from 'react'

export function useAnimation(initialDurationMs: number = 5000) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [durationMs, setDurationMs] = useState(initialDurationMs)
  const [progress, setProgress] = useState(0) // 0..1
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  const play = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const stop = useCallback(() => {
    setIsPlaying(false)
    setProgress(0)
    startTimeRef.current = null
  }, [])

  const setScrub = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value))
    setProgress(clamped)
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      startTimeRef.current = null
      return
    }

    const tick = (now: number) => {
      if (startTimeRef.current == null) startTimeRef.current = now - progress * durationMs
      const elapsed = now - startTimeRef.current
      const looped = elapsed % durationMs
      const t = looped / durationMs
      setProgress(t)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [isPlaying, durationMs])

  return {
    isPlaying,
    durationMs,
    progress,
    play,
    pause,
    stop,
    setDurationMs,
    setScrub,
  }
}


