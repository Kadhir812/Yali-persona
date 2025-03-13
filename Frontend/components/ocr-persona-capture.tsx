"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X, Check, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Persona } from "@/types/persona"

interface OCRCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (persona: Persona) => void
}

export default function OCRCaptureModal({ isOpen, onClose, onAdd }: OCRCaptureModalProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [textInput, setTextInput] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<Partial<Persona> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // In a real implementation, this would access the device camera
    // For now, we'll just trigger the file input
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const processImage = () => {
    // Simulate OCR processing
    setIsProcessing(true)

    // In a real implementation, this would send the image to an OCR service
    setTimeout(() => {
      // Mock extracted data
      setExtractedData({
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 (555) 123-4567",
        type: "Employees",
        role: "Software Engineer",
        department: "Engineering",
      })
      setIsProcessing(false)
    }, 2000)
  }

  const processText = () => {
    // Text processing removed as per requirements
    setActiveTab("image")
  }

  const handleAddPersona = () => {
    if (extractedData && extractedData.name) {
      const newPersona: Persona = {
        id: Date.now().toString(),
        name: extractedData.name || "Unknown",
        type: extractedData.type || "Employees",
        email: extractedData.email || "",
        phone: extractedData.phone || "",
        location: extractedData.location || "",
        role: extractedData.role,
        department: extractedData.department,
        added: new Date().toISOString().split("T")[0],
        isFavorite: false,
        status: "Active",
      }

      onAdd(newPersona)
      resetForm()
    }
  }

  const resetForm = () => {
    setTextInput("")
    setImageFile(null)
    setImagePreview(null)
    setExtractedData(null)
    setActiveTab("text")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Persona via Text or Image</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="image">Image Capture</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <div className="flex items-center justify-center p-6 border rounded-md">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Use image capture to extract persona information</p>
                <Button onClick={() => setActiveTab("image")} className="mt-2">
                  Switch to Image Capture
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleCameraCapture}>
                  <Camera className="mr-2 h-4 w-4" />
                  Capture Image
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
              </div>

              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-[200px] object-contain border rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {!imagePreview && (
                <div className="border rounded-md h-[200px] flex items-center justify-center text-muted-foreground">
                  No image selected
                </div>
              )}

              <Button onClick={processImage} disabled={!imageFile || isProcessing} className="w-full">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Image...
                  </>
                ) : (
                  "Extract Information from Image"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {extractedData && (
          <div className="mt-6 border rounded-md p-4">
            <h3 className="font-medium mb-2 flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              Extracted Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="extracted-name">Name</Label>
                <Input
                  id="extracted-name"
                  value={extractedData.name || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extracted-email">Email</Label>
                <Input
                  id="extracted-email"
                  value={extractedData.email || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extracted-phone">Phone</Label>
                <Input
                  id="extracted-phone"
                  value={extractedData.phone || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extracted-role">Role</Label>
                <Input
                  id="extracted-role"
                  value={extractedData.role || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, role: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extracted-department">Department</Label>
                <Input
                  id="extracted-department"
                  value={extractedData.department || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, department: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="extracted-location">Location</Label>
                <Input
                  id="extracted-location"
                  value={extractedData.location || ""}
                  onChange={(e) => setExtractedData({ ...extractedData, location: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAddPersona} disabled={!extractedData || !extractedData.name}>
            Add Persona
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

