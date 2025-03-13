"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileSpreadsheet, Upload, FileText } from "lucide-react"
import type { Persona } from "@/types/persona"

interface ImportDataModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (personas: Persona[]) => void
}

export default function ImportDataModal({ isOpen, onClose, onImport }: ImportDataModalProps) {
  const [importMethod, setImportMethod] = useState<"csv" | "json" | "paste">("csv")
  const [file, setFile] = useState<File | null>(null)
  const [pasteData, setPasteData] = useState("")
  const [processing, setProcessing] = useState(false)
  const [preview, setPreview] = useState<Persona[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      previewFile(e.target.files[0])
    }
  }

  const previewFile = (file: File) => {
    setProcessing(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        let data: Persona[] = []

        if (importMethod === "csv" && e.target?.result) {
          // Simple CSV parsing (would be more robust in production)
          const csvContent = e.target.result as string
          const lines = csvContent.split("\n")
          const headers = lines[0].split(",")

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const persona: any = {
              id: Date.now().toString() + i,
              isFavorite: false,
              status: "Active",
              added: new Date().toISOString().split("T")[0],
            }

            headers.forEach((header, index) => {
              const key = header.trim()
              if (values[index]) {
                persona[key] = values[index].trim()
              }
            })

            data.push(persona as Persona)
          }
        } else if (importMethod === "json" && e.target?.result) {
          // Parse JSON
          data = JSON.parse(e.target.result as string)

          // Ensure required fields
          data = data.map((item: any, index: number) => ({
            id: item.id || Date.now().toString() + index,
            name: item.name || "Unknown",
            type: item.type || "Employees",
            location: item.location || "Unknown",
            isFavorite: item.isFavorite || false,
            status: item.status || "Active",
            added: item.added || new Date().toISOString().split("T")[0],
            ...item,
          }))
        }

        setPreview(data.slice(0, 3)) // Preview first 3 items
        setProcessing(false)
      } catch (error) {
        console.error("Error parsing file:", error)
        setProcessing(false)
      }
    }

    if (importMethod === "csv") {
      reader.readAsText(file)
    } else if (importMethod === "json") {
      reader.readAsText(file)
    }
  }

  const handlePasteDataImport = () => {
    setProcessing(true)

    try {
      let data: Persona[] = []

      if (importMethod === "paste") {
        // Try to parse as JSON first
        try {
          data = JSON.parse(pasteData)
        } catch {
          // If not JSON, try CSV
          const lines = pasteData.split("\n")
          const headers = lines[0].split(",")

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const persona: any = {
              id: Date.now().toString() + i,
              isFavorite: false,
              status: "Active",
              added: new Date().toISOString().split("T")[0],
            }

            headers.forEach((header, index) => {
              const key = header.trim()
              if (values[index]) {
                persona[key] = values[index].trim()
              }
            })

            data.push(persona as Persona)
          }
        }

        // Ensure required fields
        data = data.map((item: any, index: number) => ({
          id: item.id || Date.now().toString() + index,
          name: item.name || "Unknown",
          type: item.type || "Employees",
          location: item.location || "Unknown",
          isFavorite: item.isFavorite || false,
          status: item.status || "Active",
          added: item.added || new Date().toISOString().split("T")[0],
          ...item,
        }))

        setPreview(data.slice(0, 3)) // Preview first 3 items
      }

      setProcessing(false)
    } catch (error) {
      console.error("Error parsing pasted data:", error)
      setProcessing(false)
    }
  }

  const handleImport = () => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          let data: Persona[] = []

          if (importMethod === "csv" && e.target?.result) {
            // Parse CSV
            const csvContent = e.target.result as string
            const lines = csvContent.split("\n")
            const headers = lines[0].split(",")

            for (let i = 1; i < lines.length; i++) {
              if (!lines[i].trim()) continue

              const values = lines[i].split(",")
              const persona: any = {
                id: Date.now().toString() + i,
                isFavorite: false,
                status: "Active",
                added: new Date().toISOString().split("T")[0],
              }

              headers.forEach((header, index) => {
                const key = header.trim()
                if (values[index]) {
                  persona[key] = values[index].trim()
                }
              })

              data.push(persona as Persona)
            }
          } else if (importMethod === "json" && e.target?.result) {
            // Parse JSON
            data = JSON.parse(e.target.result as string)

            // Ensure required fields
            data = data.map((item: any, index: number) => ({
              id: item.id || Date.now().toString() + index,
              name: item.name || "Unknown",
              type: item.type || "Employees",
              location: item.location || "Unknown",
              isFavorite: item.isFavorite || false,
              status: item.status || "Active",
              added: item.added || new Date().toISOString().split("T")[0],
              ...item,
            }))
          }

          onImport(data)
          resetForm()
          onClose()
        } catch (error) {
          console.error("Error importing file:", error)
        }
      }

      if (importMethod === "csv" || importMethod === "json") {
        reader.readAsText(file)
      }
    } else if (importMethod === "paste" && pasteData) {
      try {
        let data: Persona[] = []

        // Try to parse as JSON first
        try {
          data = JSON.parse(pasteData)
        } catch {
          // If not JSON, try CSV
          const lines = pasteData.split("\n")
          const headers = lines[0].split(",")

          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue

            const values = lines[i].split(",")
            const persona: any = {
              id: Date.now().toString() + i,
              isFavorite: false,
              status: "Active",
              added: new Date().toISOString().split("T")[0],
            }

            headers.forEach((header, index) => {
              const key = header.trim()
              if (values[index]) {
                persona[key] = values[index].trim()
              }
            })

            data.push(persona as Persona)
          }
        }

        // Ensure required fields
        data = data.map((item: any, index: number) => ({
          id: item.id || Date.now().toString() + index,
          name: item.name || "Unknown",
          type: item.type || "Employees",
          location: item.location || "Unknown",
          isFavorite: item.isFavorite || false,
          status: item.status || "Active",
          added: item.added || new Date().toISOString().split("T")[0],
          ...item,
        }))

        onImport(data)
        resetForm()
        onClose()
      } catch (error) {
        console.error("Error importing pasted data:", error)
      }
    }
  }

  const resetForm = () => {
    setFile(null)
    setPasteData("")
    setPreview([])
    setProcessing(false)
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Persona Data
          </DialogTitle>
        </DialogHeader>

        <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as "csv" | "json" | "paste")}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="csv">
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              CSV
            </TabsTrigger>
            <TabsTrigger value="json">
              <FileText className="h-4 w-4 mr-2" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="paste">
              <Upload className="h-4 w-4 mr-2" />
              Paste Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="csv" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvUpload">Upload CSV file</Label>
              <Input id="csvUpload" type="file" accept=".csv" onChange={handleFileChange} />
              {file && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm">Selected: {file.name}</p>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>CSV should have headers with these fields:</p>
              <p>name, type, email, phone, location, role, department, etc.</p>
            </div>
          </TabsContent>

          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jsonUpload">Upload JSON file</Label>
              <Input id="jsonUpload" type="file" accept=".json" onChange={handleFileChange} />
              {file && (
                <div className="mt-2 p-2 border rounded-md">
                  <p className="text-sm">Selected: {file.name}</p>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <p>JSON should be an array of persona objects with required fields:</p>
              <p>name, type, location</p>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pasteData">Paste CSV or JSON data</Label>
              <textarea
                id="pasteData"
                className="w-full min-h-[150px] p-2 border rounded-md"
                placeholder="Paste your CSV or JSON data here..."
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
              />
            </div>
            <Button onClick={handlePasteDataImport} disabled={!pasteData.trim() || processing} className="w-full">
              {processing ? "Processing..." : "Preview Data"}
            </Button>
          </TabsContent>
        </Tabs>

        {preview.length > 0 && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium mb-2">Preview ({preview.length} items):</h3>
            <div className="space-y-2 text-sm max-h-[200px] overflow-y-auto">
              {preview.map((item, index) => (
                <div key={index} className="p-2 border rounded bg-white">
                  <p>
                    <span className="font-medium">Name:</span> {item.name}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {item.type}
                  </p>
                  {item.email && (
                    <p>
                      <span className="font-medium">Email:</span> {item.email}
                    </p>
                  )}
                  {item.location && (
                    <p>
                      <span className="font-medium">Location:</span> {item.location}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={(importMethod !== "paste" && !file) || (importMethod === "paste" && !pasteData)}
          >
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

