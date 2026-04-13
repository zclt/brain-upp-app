import { Badge } from '@/components/ui/badge'

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Badge variant="secondary" className="text-xs rounded-full">
      {tag}
    </Badge>
  )
}
