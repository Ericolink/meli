import { motion, type HTMLMotionProps } from 'motion/react'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  /** Desplazamiento vertical inicial en px. */
  offset?: number
  /** Porción visible necesaria para disparar la animación. */
  amount?: number
}

/** Aparición suave (opacity + transform) al entrar en el viewport. */
export function Reveal({ delay = 0, offset = 22, amount = 0.25, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
