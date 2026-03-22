'use client'
import { RefObject, useEffect } from 'react'

export function useHolographicTilt(containerRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width) * 100
      const py = ((e.clientY - r.top) / r.height) * 100
      el.style.setProperty('--hero-x', px + '%')
      el.style.setProperty('--hero-y', py + '%')
      el.style.setProperty('--hero-angle', (118 + (px - 50) * 0.42) + 'deg')
    }
    const onLeave = () => {
      el.style.setProperty('--hero-x', '50%')
      el.style.setProperty('--hero-y', '50%')
      el.style.setProperty('--hero-angle', '118deg')
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [containerRef])
}
