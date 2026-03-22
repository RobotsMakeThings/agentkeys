'use client'
import { useEffect, useRef } from 'react'
import SkillCard from '@/components/ui/SkillCard'
import type { RarityTier } from '@/types/agentkeys'

const CARDS: Array<{
  img: string
  name: string
  subtitle: string
  rarityTier: RarityTier
  serial: string
  tags: string[]
}> = [
  { img: '/images/card-oshi.webp', name: 'Oshi', subtitle: 'Oracle of Signal', rarityTier: 'legendary', serial: 'AK-001', tags: ['BTC', 'PREDICTION', 'SIGNALS', 'KALSHI'] },
  { img: '/images/card-sora.webp', name: 'Sora', subtitle: 'Signal Weaver', rarityTier: 'epic', serial: 'AK-002', tags: ['NLP', 'REASONING', 'SYNTHESIS'] },
  { img: '/images/card-nova.webp', name: 'Nova', subtitle: 'Data Architect', rarityTier: 'rare', serial: 'AK-003', tags: ['DATA', 'PIPELINES', 'ETL'] },
  { img: '/images/card-4.webp', name: 'Kira', subtitle: 'Market Oracle', rarityTier: 'uncommon', serial: 'AK-004', tags: ['MARKETS', 'TRADING'] },
  { img: '/images/card-5.webp', name: 'Axe', subtitle: 'Protocol Handler', rarityTier: 'basic', serial: 'AK-005', tags: ['EXECUTION', 'OPS'] },
]

export default function CardCarousel() {
  const shellRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let angle = 0
    let paused = false
    let lastTime = performance.now()
    let rafId: number
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const COUNT = CARDS.length

    const layout = () => {
      const items = carouselRef.current?.querySelectorAll<HTMLElement>('.carousel-item')
      if (!items) return
      const isMobile = window.innerWidth < 700
      const isTablet = window.innerWidth < 1100
      const radiusX = isMobile ? 130 : isTablet ? 190 : 250
      const radiusZ = isMobile ? 110 : isTablet ? 160 : 215
      let frontIdx = 0, frontScore = -Infinity

      items.forEach((item, i) => {
        const a = angle + i * ((Math.PI * 2) / COUNT)
        const x = Math.sin(a) * radiusX
        const z = Math.cos(a) * radiusZ
        const depth = Math.cos(a)
        const scale = 0.8 + ((depth + 1) / 2) * 0.22
        const y = (1 - depth) * (isMobile ? 10 : 16)
        const face = -Math.sin(a) * (isMobile ? 7 : 10)
        item.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z.toFixed(2)}px) rotateY(${face.toFixed(2)}deg) scale(${scale.toFixed(3)})`
        item.style.zIndex = String(Math.round((depth + 1) * 100))
        item.style.filter = `brightness(${(0.88 + ((depth + 1) / 2) * 0.12).toFixed(3)})`
        if (depth > frontScore) { frontScore = depth; frontIdx = i }
      })
      items.forEach((item, i) => item.classList.toggle('is-front', i === frontIdx))
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      if (!paused && !reduceMotion) {
        angle += dt * 0.42
        if (angle > Math.PI * 2) angle -= Math.PI * 2
        layout()
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    layout()

    const shell = shellRef.current
    const onEnter = () => { paused = true; shell?.classList.add('paused') }
    const onLeave = () => { paused = false; shell?.classList.remove('paused') }
    shell?.addEventListener('mouseenter', onEnter)
    shell?.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      shell?.removeEventListener('mouseenter', onEnter)
      shell?.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={shellRef}
      className="carousel-shell"
      style={{
        position: 'relative', height: 680,
        perspective: 1800, perspectiveOrigin: '50% 42%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        ref={carouselRef}
        style={{
          position: 'relative', width: '100%', maxWidth: 1100, height: 620,
          transformStyle: 'preserve-3d',
        }}
      >
        {CARDS.map((card, i) => (
          <div key={i} className="carousel-item">
            <SkillCard
              artImageUrl={card.img}
              name={card.name}
              subtitle={card.subtitle}
              rarityTier={card.rarityTier}
              serial={card.serial}
              size="md"
              skillTags={card.tags}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
