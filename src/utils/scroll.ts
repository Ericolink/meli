export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Desplaza suavemente hasta una sección y mueve el foco a ella (accesibilidad). */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const focusTarget = el.querySelector<HTMLElement>('h1, h2') ?? el
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1')
  focusTarget.focus({ preventScroll: true })
}
