import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, GitBranch, GitFork, Package } from "lucide-react"
import Link from "next/link"

export default function NewApplicationPage() {
  return (
    <div className="flex flex-col h-full">
      {/* <div className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">返回</span>
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">新业务申请</h1>
      </div> */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl pb-6">
          <Tabs defaultValue="new-project" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new-project">新项目申请</TabsTrigger>
              <TabsTrigger value="new-module">新模块申请</TabsTrigger>
            </TabsList>
            <TabsContent value="new-project">
              <Card>
                <CardHeader>
                  <CardTitle>新项目 CI 申请</CardTitle>
                  <CardDescription>填写以下信息，将新项目添加到 CI 系统中</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">项目名称</Label>
                    <Input id="project-name" placeholder="输入项目名称" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">代码仓库地址</Label>
                    <div className="flex items-center gap-2">
                      <GitFork className="h-4 w-4 text-muted-foreground" />
                      <Input id="repo-url" placeholder="例如: https://git.example.com/project.git" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="branch">主分支</Label>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <Input id="branch" placeholder="例如: master" defaultValue="master" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="jdk-version">JDK 版本</Label>
                      <Select defaultValue="11">
                        <SelectTrigger id="jdk-version">
                          <SelectValue placeholder="选择 JDK 版本" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="8">JDK 8</SelectItem>
                          <SelectItem value="11">JDK 11</SelectItem>
                          <SelectItem value="17">JDK 17</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ci-type">CI 类型</Label>
                      <Select defaultValue="app">
                        <SelectTrigger id="ci-type">
                          <SelectValue placeholder="选择 CI 类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="app">App CI</SelectItem>
                          <SelectItem value="system">系统 CI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="build-type">构建类型</Label>
                      <Select defaultValue="sc">
                        <SelectTrigger id="build-type">
                          <SelectValue placeholder="选择构建类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sc">SC 编译</SelectItem>
                          <SelectItem value="as">AS 编译</SelectItem>
                          <SelectItem value="module">模块编译</SelectItem>
                          <SelectItem value="full">全量版本编译</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">版本号</Label>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <Input id="version" placeholder="例如: 1.0.0" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">项目描述</Label>
                    <Textarea id="description" placeholder="请简要描述项目功能和用途" rows={3} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">取消</Button>
                  <Button>提交申请</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="new-module">
              <Card>
                <CardHeader>
                  <CardTitle>新模块 CI 申请</CardTitle>
                  <CardDescription>填写以下信息，将新模块添加到现有项目的 CI 系统中</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="parent-project">所属项目</Label>
                    <Select>
                      <SelectTrigger id="parent-project">
                        <SelectValue placeholder="选择所属项目" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="android-app-main">android-app-main</SelectItem>
                        <SelectItem value="system-core">system-core</SelectItem>
                        <SelectItem value="ui-framework">ui-framework</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-name">模块名称</Label>
                    <Input id="module-name" placeholder="输入模块名称" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-path">模块路径</Label>
                    <Input id="module-path" placeholder="例如: modules/feature-x" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="module-branch">分支</Label>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <Input id="module-branch" placeholder="例如: feature/x" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="module-build-type">构建类型</Label>
                      <Select defaultValue="module">
                        <SelectTrigger id="module-build-type">
                          <SelectValue placeholder="选择构建类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="module">模块编译</SelectItem>
                          <SelectItem value="sc">SC 编译</SelectItem>
                          <SelectItem value="as">AS 编译</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="module-description">模块描述</Label>
                    <Textarea id="module-description" placeholder="请简要描述模块功能和用途" rows={3} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">取消</Button>
                  <Button>提交申请</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
