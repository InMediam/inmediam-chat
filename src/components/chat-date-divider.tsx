interface ChatDateDividerProps {
  label: string
}

export function ChatDateDivider({ label }: ChatDateDividerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-quaternary" />
      <span className="shrink-0 text-sm font-medium text-quaternary">
        {label}
      </span>
      <div className="h-px flex-1 bg-quaternary" />
    </div>
  )
}
