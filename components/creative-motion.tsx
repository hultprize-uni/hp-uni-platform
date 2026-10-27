'use client'
import { useEffect } from 'react'

export function CreativeMotion() {
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(hover: hover) and (pointer: fine)')
    let dispose = () => {}
    function setup() {
      dispose()
      if (reduced.matches) return
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('motion-arrived')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: .12 })
      const targets = [...document.querySelectorAll<HTMLElement>('.photo-card, .stage-card, main section h2')]
      targets.forEach((element, index) => {
        element.style.setProperty('--reveal-delay', `${index % 3 * 65}ms`)
        observer.observe(element)
      })
      const photos = [...document.querySelectorAll<HTMLElement>('[aria-roledescription="carrusel"], .photo-card')]
      const removers = photos.map(photo => {
        let frame = 0
        const move = (event: PointerEvent) => {
          if (!fine.matches || event.pointerType === 'touch') return
          cancelAnimationFrame(frame)
          frame = requestAnimationFrame(() => {
            const box = photo.getBoundingClientRect()
            photo.style.setProperty('--photo-x', `${((event.clientX - box.left) / box.width - .5) * 12}px`)
            photo.style.setProperty('--photo-y', `${((event.clientY - box.top) / box.height - .5) * 12}px`)
          })
        }
        const reset = () => {
          cancelAnimationFrame(frame)
          photo.style.setProperty('--photo-x', '0px')
          photo.style.setProperty('--photo-y', '0px')
        }
        photo.addEventListener('pointermove', move)
        photo.addEventListener('pointerleave', reset)
        return () => { reset(); photo.removeEventListener('pointermove', move); photo.removeEventListener('pointerleave', reset) }
      })
      dispose = () => {
        observer.disconnect()
        removers.forEach(remove => remove())
        targets.forEach(element => { element.classList.remove('motion-arrived'); element.style.removeProperty('--reveal-delay') })
      }
    }
    setup()
    reduced.addEventListener('change', setup)
    return () => { dispose(); reduced.removeEventListener('change', setup) }
  }, [])
  return null
}
