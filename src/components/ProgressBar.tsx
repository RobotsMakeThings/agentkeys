'use client'
import { useEffect, useRef } from 'react'

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const ratio = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      if (barRef.current) barRef.current.style.width = (Math.min(1, ratio) * 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div ref={barRef} className="progress-bar" style={{ width: '0%' }} />
}
