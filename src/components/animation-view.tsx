import { AnimatePresence, motion } from 'framer-motion'

export function AnimationView({
  view,
  children,
  disableLayout = false,
}: {
  view: string
  children: React.ReactNode
  // Desativa a animação de layout (altura): útil quando o container tem altura fixa,
  // evitando o "resize" do conteúdo ao alternar elementos dentro da mesma view.
  disableLayout?: boolean
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="grid"
        key={view}
        layout={!disableLayout}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{
          duration: 0.3,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
