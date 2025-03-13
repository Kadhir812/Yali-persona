"use client"

import { useState } from "react"
import { FileDown, FileSpreadsheet, FileJson, FileText, FileCheck } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Separator } from "./ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface ExportDataDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function ExportDataDialog({ isOpen, onClose }: ExportDataDialogProps) {
  const [fileFormat, setFileFormat] = useState("csv")
  const [exportScope, setExportScope] = useState("all")
  const [selectedFields, setSelectedFields] = useState<string[]>([
    "name",
    "email",
    "phone",
    "type",
    "location",
    "isFavorite",
  ])

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const handleExport = () => {
    // In a real application, this would trigger an API call to generate
    // the export file and download it
    console.log("Exporting data:", {
      fileFormat,
      exportScope,
      selectedFields,
    })

    // Simulate a download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `persona-dashboard-export.${fileFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    onClose()
  }

  const resetForm = () => {
    setFileFormat("csv")
    setExportScope("all")
    setSelectedFields(["name", "email", "phone", "type", "location", "isFavorite"])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const getFileIcon = () => {
    switch (fileFormat) {
      case "csv":
        return <FileSpreadsheet className="h-5 w-5" />
      case "json":
        return <FileJson className="h-5 w-5" />
      case "txt":
        return <FileText className="h-5 w-5" />
      default:
        return <FileDown className="h-5 w-5" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon()}
            Export Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="file-format">File Format</Label>
                <Select value={fileFormat} onValueChange={setFileFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="txt">Plain Text</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Scope</Label>
                <RadioGroup value={exportScope} onValueChange={setExportScope}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Personas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="filtered" id="filtered" />
                    <Label htmlFor="filtered">Current Filter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="favorites" id="favorites" />
                    <Label htmlFor="favorites">Favorites Only</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Fields to Export</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedFields([
                    "id",
                    "name",
                    "email",
                    "phone",
                    "type",
                    "location",
                    "role",
                    "department",
                    "added",
                    "lastInteraction",
                    "isFavorite",
                    "status",
                  ])
                }
                className="text-xs"
              >
                <FileCheck className="h-3 w-3 mr-1" />
                Select All
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-name"
                  checked={selectedFields.includes("name")}
                  onCheckedChange={() => handleFieldToggle("name")}
                />
                <Label htmlFor="field-name">Name</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-email"
                  checked={selectedFields.includes("email")}
                  onCheckedChange={() => handleFieldToggle("email")}
                />
                <Label htmlFor="field-email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-phone"
                  checked={selectedFields.includes("phone")}
                  onCheckedChange={() => handleFieldToggle("phone")}
                />
                <Label htmlFor="field-phone">Phone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-type"
                  checked={selectedFields.includes("type")}
                  onCheckedChange={() => handleFieldToggle("type")}
                />
                <Label htmlFor="field-type">Type</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-location"
                  checked={selectedFields.includes("location")}
                  onCheckedChange={() => handleFieldToggle("location")}
                />
                <Label htmlFor="field-location">Location</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-role"
                  checked={selectedFields.includes("role")}
                  onCheckedChange={() => handleFieldToggle("role")}
                />
                <Label htmlFor="field-role">Role</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-department"
                  checked={selectedFields.includes("department")}
                  onCheckedChange={() => handleFieldToggle("department")}
                />
                <Label htmlFor="field-department">Department</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-added"
                  checked={selectedFields.includes("added")}
                  onCheckedChange={() => handleFieldToggle("added")}
                />
                <Label htmlFor="field-added">Date Added</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="field-favorite"
                  checked={selectedFields.includes("isFavorite")}
                  onCheckedChange={() => handleFieldToggle("isFavorite")}
                />
                <Label htmlFor="field-favorite">Favorite</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleExport} disabled={selectedFields.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

