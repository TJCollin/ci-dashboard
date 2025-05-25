import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <h1 className="text-xl font-semibold">CI 流水线监控</h1>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <p className="text-muted-foreground">实时追踪和查看所有正在进行或最近完成的 CI/CD 流水线</p>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>流水线列表</CardTitle>
              <CardDescription>所有 CI/CD 流水线实例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="rounded-lg border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <div className="mt-2">
                      <Skeleton className="h-4 w-3/4" />
                      <div className="mt-1 flex items-center gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="mt-3">
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between py-4">
                <Skeleton className="h-4 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
