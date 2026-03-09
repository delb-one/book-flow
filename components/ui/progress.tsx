import { cn } from "@/lib/utils"

type ProgressProps = {
  value?: number
  className?: string
}

function Progress({ value = 0, className }: ProgressProps) {
  const safeValue = Math.max(0, Math.min(100, value))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("bg-secondary h-2 w-full overflow-hidden rounded-full", className)}
    >
      <div
        className="bg-primary h-full transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  )
}

export { Progress }
