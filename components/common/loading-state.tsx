import { Loader2 } from "lucide-react"
import type { LoadingStateProps } from "@/types"

export function LoadingState({ message = "Carregando..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      <span className="ml-2 text-gray-600">{message}</span>
    </div>
  )
}
