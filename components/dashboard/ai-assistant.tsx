"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, X } from "lucide-react"

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "assistant", content: "您好！我是 CI 助手，有什么可以帮您解决的问题吗？" },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { role: "user", content: input }])

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "感谢您的提问。我正在处理您的请求，稍后会给您回复。",
        },
      ])
    }, 1000)

    setInput("")
  }

  return (
    <>
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg">
          <Bot className="h-6 w-6" />
          <span className="sr-only">打开 AI 助手</span>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-80 sm:w-96 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <CardTitle className="text-sm font-medium">CI 助手</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">关闭</span>
            </Button>
          </CardHeader>
          <CardContent className="p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`rounded-lg px-3 py-2 max-w-[80%] ${
                      message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="输入您的问题..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend()
                  }
                }}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
                <span className="sr-only">发送</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
