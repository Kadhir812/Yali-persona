"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Users, PaperclipIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

interface SendEmailDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function SendEmailDialog({ isOpen, onClose }: SendEmailDialogProps) {
  const [to, setTo] = useState("")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [tab, setTab] = useState("compose")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real application, you would integrate with an email API
    const emailData = {
      to: to.split(",").map((email) => email.trim()),
      cc: cc ? cc.split(",").map((email) => email.trim()) : [],
      bcc: bcc ? bcc.split(",").map((email) => email.trim()) : [],
      subject,
      content,
    }

    console.log("Sending email:", emailData)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    setContent("")
    setTab("compose")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="template">Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="to">To</Label>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    id="to"
                    placeholder="recipient@example.com"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="cc">CC</Label>
                  <Input id="cc" placeholder="cc@example.com" value={cc} onChange={(e) => setCc(e.target.value)} />
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="bcc">BCC</Label>
                  <Input id="bcc" placeholder="bcc@example.com" value={bcc} onChange={(e) => setBcc(e.target.value)} />
                </div>
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div className="grid w-full items-center gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your email here..."
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center">
                <Button type="button" variant="outline" size="sm" className="gap-1">
                  <PaperclipIcon className="h-4 w-4" />
                  Attach Files
                </Button>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit">Send Email</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="template" className="min-h-[400px] flex flex-col items-center justify-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Email Templates</h3>
            <p className="text-muted-foreground text-center mb-4">
              Create and manage reusable email templates for common communications.
            </p>
            <Button variant="outline">Create New Template</Button>
          </TabsContent>

          <TabsContent value="history" className="min-h-[400px] flex flex-col items-center justify-center">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">Email History</h3>
            <p className="text-muted-foreground text-center">
              No recent emails found. Your sent emails will appear here.
            </p>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

