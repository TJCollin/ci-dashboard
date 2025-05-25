import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Minus } from "lucide-react"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendType: "positive" | "negative" | "neutral"
  icon: ReactNode
}

export function MetricCard({ title, value, trend, trendType, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {icon}
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold">{value}</span>
          <span
            className={`ml-2 flex items-center text-xs font-medium ${
              trendType === "positive"
                ? "text-green-500"
                : trendType === "negative"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {trendType === "positive" ? (
              <ArrowUp className="mr-1 h-3 w-3" />
            ) : trendType === "negative" ? (
              <ArrowDown className="mr-1 h-3 w-3" />
            ) : (
              <Minus className="mr-1 h-3 w-3" />
            )}
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
