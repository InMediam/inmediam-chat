import { cn } from '@inmediam/ui'
import { cva, type VariantProps } from 'class-variance-authority'

const wavesInnerVariants = cva(
  'relative flex items-center justify-center border border-secondary p-3 opacity-95 shadow',
  {
    variants: {
      shape: {
        square: 'rounded-lg',
        circle: 'rounded-full',
        ghost: 'border-transparent shadow-none',
      },
    },
    defaultVariants: {
      shape: 'square',
    },
  },
)

export interface WavesProps
  extends React.PropsWithChildren, VariantProps<typeof wavesInnerVariants> {
  className?: string
}

export function Waves({ children, className, shape }: WavesProps) {
  return (
    <div
      className={cn(
        'relative -z-10 flex items-center justify-center p-6',
        className,
      )}
    >
      <span className="absolute h-24 w-24 rounded-full border border-secondary opacity-90" />
      <span className="absolute h-36 w-36 rounded-full border border-secondary opacity-75" />
      <span className="absolute h-48 w-48 rounded-full border border-secondary opacity-60" />
      <span className="absolute h-60 w-60 rounded-full border border-secondary opacity-45" />
      <span className="absolute h-72 w-72 rounded-full border border-secondary opacity-30" />
      <span className="absolute h-80 w-80 rounded-full border border-secondary opacity-15" />

      <span className={cn(wavesInnerVariants({ shape }))}>{children}</span>
    </div>
  )
}
