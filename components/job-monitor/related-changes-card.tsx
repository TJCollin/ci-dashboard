"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GitPullRequest, User, Calendar } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type ChangeDocument from "@/types/change-document"

interface RelatedChangesCardProps {
  changeNumber: string
}

export function RelatedChangesCard({ changeNumber }: RelatedChangesCardProps) {
  const [changeDocument, setChangeDocument] = useState<ChangeDocument | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChangeDocument = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/change-documents/${changeNumber}`)

        if (!response.ok) {
          throw new Error(`Error fetching change document: ${response.statusText}`)
        }

        const data = await response.json()
        setChangeDocument(data)
      } catch (err) {
        console.error("Failed to fetch change document:", err)
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchChangeDocument()
  }, [changeNumber])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>关联单据</CardTitle>
          <CardDescription>构建关联的变更单据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">加载中...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !changeDocument) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>关联单据</CardTitle>
          <CardDescription>构建关联的变更单据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">无法加载单据信息</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GitPullRequest className="mr-2 h-5 w-5 text-primary" />
          关联单据
        </CardTitle>
        <CardDescription>构建关联的变更单据</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-4 w-4 text-muted-foreground" />
              <Link href={`/pipeline-monitor/${changeDocument.change_number}`} className="font-medium hover:underline">
                {changeDocument.change_number}
              </Link>
            </div>
            <Badge variant="outline">{changeDocument.status}</Badge>
          </div>
          <div className="mb-2">
            <Link
              href={`/pipeline-monitor/${changeDocument.change_number}`}
              className="text-sm font-medium hover:underline"
            >
              {changeDocument.rdc && changeDocument.rdc.title}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline">{changeDocument.ci_type}</Badge>
            <Badge variant="outline">{changeDocument.repository}</Badge>
            {changeDocument.rdc && changeDocument.rdc.key && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                {changeDocument.rdc.key}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{changeDocument.owner && changeDocument.owner.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{changeDocument.created_at && new Date(changeDocument.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
