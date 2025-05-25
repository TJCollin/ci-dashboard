import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText, Package } from "lucide-react"
import type { Artifact } from "@/types/job"

interface BuildArtifactsCardProps {
  artifacts: Artifact[]
}

export function BuildArtifactsCard({ artifacts }: BuildArtifactsCardProps) {
  if (!artifacts || artifacts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>构建产物</CardTitle>
          <CardDescription>构建过程中生成的文件</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">该构建没有产生任何文件</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2 h-5 w-5 text-primary" />
          构建产物
        </CardTitle>
        <CardDescription>构建过程中生成的文件</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {artifacts.map((artifact, index) => (
            <div key={index} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{artifact.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatFileSize(artifact.size_bytes)} · {artifact.path}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                下载
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
