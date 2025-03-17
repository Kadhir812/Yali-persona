"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Star,
  Users,
  Building2,
  UserRound,
  Briefcase,
  Filter,
  ArrowUpDown,
  Settings,
  Moon,
  Plus,
  Grid,
  List,
  Mail,
  Phone,
  MapPin,
  Check,
  Camera,
  ScanLine,
  Sun,
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover"
import { Checkbox } from "./components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Label } from "./components/ui/label"
import { Separator } from "./components/ui/separator"
import { useTheme } from "next-themes"
import AddPersonaModal from "./components/add-persona-modal"
import OcrPersonaCapture from "./components/ocr-persona-capture"
import NotificationSettings from "./components/notification-settings"
import SettingsDialog from "./components/settings-dialog"
import QuickActions from "./components/quick-actions"
import type { Persona } from "./types/persona"
// import { initialPersonas } from "./data/initial-personas"

// Add imports for the dialogs we'll create
import ScheduleMeetingDialog from "./components/schedule-meeting-dialog"
import SendEmailDialog from "./components/send-email-dialog"
import InviteTeamMemberDialog from "./components/invite-team-member-dialog"
import ShareDashboardDialog from "./components/share-dashboard-dialog"
import ImportDataDialog from "./components/import-data-dialog"
import ExportDataDialog from "./components/export-data-dialog"
import GenerateReportDialog from "./components/generate-report-dialog"
import AnalyticsDialog from "./components/analytics-dialog"
import BackupDataDialog from "./components/backup-data-dialog"
import RestoreDataDialog from "./components/restore-data-dialog"
import axios from 'axios';
import ImportDataModal from "./components/import-data-dialog"

type ViewMode = "card" | "list" | "grid" | "compact"
type SortOption = "name" | "type" | "added" | "recent"
type FilterCriteria = {
  type: string[]
  status: string[]
  location: string[]
  dateAdded: string
}

export default function PersonaDashboard() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [favorites, setFavorites] = useState<Persona[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("")
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false)
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"compact" | "list">("compact");
  const [favViewMode, setFavViewMode] = useState<"grid" | "card" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  // const [ISImportDataOpen, setIsImportDataOpen] = useState(false)
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>({
    type: [],
    status: [],
    location: [],
    dateAdded: "all",
  })
  const API_BASE_URL = "http://localhost:5000/api"; 

  // Add state variables for all the dialogs
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false)
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false)
  const [isInviteTeamMemberOpen, setIsInviteTeamMemberOpen] = useState(false)
  const [isShareDashboardOpen, setIsShareDashboardOpen] = useState(false)
  const [isImportDataOpen, setIsImportDataOpen] = useState(false)
  const [isExportDataOpen, setIsExportDataOpen] = useState(false)
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false)
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false)
  const [isBackupDataOpen, setIsBackupDataOpen] = useState(false)
  const [isRestoreDataOpen, setIsRestoreDataOpen] = useState(false)

    // Calculate counts dynamically
    const employeeCount = personas.filter((p) => p.type === "Employees").length;
    const vendorCount = personas.filter((p) => p.type === "Vendors").length;
    const customerCount = personas.filter((p) => p.type === "Customers").length;
    const investorCount = personas.filter((p) => p.type === "Investors").length;



    useEffect(() => {
      const fetchPersonas = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/personas`);
          const formattedData = response.data.map((persona: any) => ({
            ...persona,
            persona_id: persona.persona_id || persona.id,
            isFavorite: persona.is_favorite, // Ensuring correct mapping
          }));
          setPersonas(formattedData);
          setFavorites(formattedData.filter((p) => p.isFavorite));
        } catch (error) {
          console.error("Failed to fetch personas:", error);
          setError("Failed to fetch personas. Please try again.");
        }
      };


      fetchPersonas();
    }, []);

    useEffect(() => {
      setFavorites(personas.filter((persona) => persona.isFavorite));
    }, [personas]);
     

  const toggleFavorite = async (persona_id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedPersonas = personas.map((persona) =>
        persona.persona_id === persona_id
          ? { ...persona, isFavorite: !persona.isFavorite }
          : persona
      );

      setPersonas(updatedPersonas);
      setFavorites(updatedPersonas.filter((p) => p.isFavorite));

      await axios.patch(`${API_BASE_URL}/personas/${persona_id}/favorite`, {
        is_favorite: updatedPersonas.find((p) => p.persona_id === persona_id)?.isFavorite ?? false,
      });

      console.log(`✅ Favorite updated for Persona ID: ${persona_id}`);

    } catch (error) {
      console.error("❌ Failed to update favorite status:", error);
      setError("Failed to update favorite status. Please try again.");
    }
  };



  
    // Add persona and refresh list
  const handleAddPersona = async (newPersona: Persona) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/personas`, newPersona);

      if (!response.data || !response.data.data) {
        console.error("❌ Unexpected API response:", response);
        setError("Failed to add persona. Please try again.");
        return;
      }

      const savedPersona = {
        ...response.data.data,
        persona_id: response.data.data.persona_id || response.data.data.id, // Ensure ID consistency
        isFavorite: response.data.data.is_favorite ?? false,
      };

      console.log(`✅ Persona added successfully:`, savedPersona);

      setPersonas((prev) => [...prev, savedPersona]); // Add to UI immediately
      if (savedPersona.isFavorite) {
        setFavorites((prev) => [...prev, savedPersona]);
      }

      setIsAddModalOpen(false);
    } catch (error) {
      console.error("❌ Failed to add persona:", error);
      setError("Error adding persona. Please check your inputs and try again.");
    }
  };

  const applyAdvancedFilter = (criteria: FilterCriteria) => {
    setFilterCriteria(criteria)
    setIsAdvancedFilterOpen(false)
  }

  const resetFilters = () => {
    setFilterCriteria({
      type: [],
      status: [],
      location: [],
      dateAdded: "all",
    })
  }

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      toggleSortDirection()
    } else {
      setSortBy(option)
      setSortDirection("asc")
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Define a function to handle printing the summary
  const handlePrintSummary = () => {
    window.print()
  }

  // Navigate to profile page
  const navigateToProfile = (id: string) => {
    router.push(`/profile/${id}`)
  }

  // Filter personas based on search query and advanced filters
  const filteredPersonas = personas.filter((persona) => {
    // Text search
    const matchesSearch =
      searchQuery === "" ||
      persona.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      persona.email?.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    const matchesType = filterCriteria.type.length === 0 || filterCriteria.type.includes(persona.type)

    // Status filter
    const matchesStatus =
      filterCriteria.status.length === 0 || filterCriteria.status.includes(persona.status || "Active")

    // Location filter
    const matchesLocation = filterCriteria.location.length === 0 || filterCriteria.location.includes(persona.location)

    // Date filter
    let matchesDate = true
    if (filterCriteria.dateAdded !== "all") {
      const addedDate = new Date(persona.added)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (filterCriteria.dateAdded) {
        case "today":
          matchesDate = daysDiff < 1
          break
        case "week":
          matchesDate = daysDiff < 7
          break
        case "month":
          matchesDate = daysDiff < 30
          break
        case "quarter":
          matchesDate = daysDiff < 90
          break
      }
    }

    return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesDate
  })

  // Sort filtered personas
  const sortedPersonas = [...filteredPersonas].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "type":
        comparison = a.type.localeCompare(b.type)
        break
      case "added":
        comparison = new Date(a.added).getTime() - new Date(b.added).getTime()
        break
      case "recent":
        // Assuming there's a lastInteraction field, fallback to added date
        const aDate = a.lastInteraction ? new Date(a.lastInteraction).getTime() : new Date(a.added).getTime()
        const bDate = b.lastInteraction ? new Date(b.lastInteraction).getTime() : new Date(b.added).getTime()
        comparison = aDate - bDate
        break
    }

    return sortDirection === "asc" ? comparison : -comparison
  })

  // Get all unique locations for filter
  const allLocations = Array.from(new Set(personas.map((p) => p.location)))

  // Calculate favorited percentage
  const favoritedPercentage = personas.length > 0 ? (favorites.length / personas.length) * 100 : 0;

  // Active filter count
  const activeFilterCount =
    filterCriteria.type.length +
    filterCriteria.status.length +
    filterCriteria.location.length +
    (filterCriteria.dateAdded !== "all" ? 1 : 0)

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Persona OCR Capture Section */}
      <div className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <ScanLine className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">YALI MOBILITY</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsOcrModalOpen(true)} className="flex items-center">
              <Camera className="h-4 w-4 mr-2" /> Capture with Camera
            </Button>
            <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Manually
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-end">
        <Popover open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px] p-0" align="end">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
            <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
              <div>
                <h4 className="font-medium mb-2">Persona Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Employees", "Vendors", "Customers", "Investors"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type}`}
                        checked={filterCriteria.type.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterCriteria({
                              ...filterCriteria,
                              type: [...filterCriteria.type, type],
                            })
                          } else {
                            setFilterCriteria({
                              ...filterCriteria,
                              type: filterCriteria.type.filter((t) => t !== type),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`type-${type}`}>{type}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["Active", "Inactive", "Pending"].map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`status-${status}`}
                        checked={filterCriteria.status.includes(status)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterCriteria({
                              ...filterCriteria,
                              status: [...filterCriteria.status, status],
                            })
                          } else {
                            setFilterCriteria({
                              ...filterCriteria,
                              status: filterCriteria.status.filter((s) => s !== status),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`status-${status}`}>{status}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <div className="grid grid-cols-2 gap-2">
                  {allLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={filterCriteria.location.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterCriteria({
                              ...filterCriteria,
                              location: [...filterCriteria.location, location],
                            })
                          } else {
                            setFilterCriteria({
                              ...filterCriteria,
                              location: filterCriteria.location.filter((l) => l !== location),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`location-${location}`}>{location}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Date Added</h4>
                <RadioGroup
                  value={filterCriteria.dateAdded}
                  onValueChange={(value) => {
                    setFilterCriteria({
                      ...filterCriteria,
                      dateAdded: value,
                    })
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="date-all" />
                    <Label htmlFor="date-all">All time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="today" id="date-today" />
                    <Label htmlFor="date-today">Today</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="week" id="date-week" />
                    <Label htmlFor="date-week">Last 7 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="month" id="date-month" />
                    <Label htmlFor="date-month">Last 30 days</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="quarter" id="date-quarter" />
                    <Label htmlFor="date-quarter">Last 90 days</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => applyAdvancedFilter(filterCriteria)}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
              {sortDirection === "asc" ? " ↑" : " ↓"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleSort("name")}>
                {sortBy === "name" && (
                  <Check className={`mr-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                )}
                <span className={sortBy === "name" ? "font-medium" : ""}>Name</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("type")}>
                {sortBy === "type" && (
                  <Check className={`mr-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                )}
                <span className={sortBy === "type" ? "font-medium" : ""}>Type</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("added")}>
                {sortBy === "added" && (
                  <Check className={`mr-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                )}
                <span className={sortBy === "added" ? "font-medium" : ""}>Date Added</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("recent")}>
                {sortBy === "recent" && (
                  <Check className={`mr-2 h-4 w-4 ${sortDirection === "asc" ? "rotate-0" : "rotate-180"}`} />
                )}
                <span className={sortBy === "recent" ? "font-medium" : ""}>Recently Active</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleSortDirection}>
              {sortDirection === "asc" ? "Sort Descending" : "Sort Ascending"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="text-2xl font-bold mb-4">Persona Dashboard</h1>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-3xl font-bold">{employeeCount}</p>
                <p>Employees</p>
              </div>
              <Users className="h-10 w-10" />
              </CardContent>
            </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-3xl font-bold">{vendorCount}</p>
                <p>Vendors</p>
              </div>
              <Building2 className="h-10 w-10" />
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-3xl font-bold">{customerCount}</p>
                <p>Customers</p>
              </div>
              <UserRound className="h-10 w-10" />
            </CardContent>
          </Card>
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="flex justify-between items-center p-6">
              <div>
                <p className="text-3xl font-bold">{investorCount}</p>
                <p>Investors</p>
              </div>
              <Briefcase className="h-10 w-10" />
            </CardContent>
          </Card>
        </div>

        {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Favorite Personas Section */}
          {favorites.length > 0 && (
            <Card className="mb-6 bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-amber-400 mr-2" />
                    <h2 className="text-xl font-bold">Favorite Personas</h2>
                  </div>
                  <div className="text-sm text-gray-500">{favorites.length} favorites</div>
                  <div className="flex space-x-1">
                    <Button
                      variant={favViewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFavViewMode("grid")}
                      className="h-8 w-8 p-0"
                      title="Grid view"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={favViewMode === "card" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFavViewMode("card")}
                      className="h-8 w-8 p-0"
                      title="Card view"
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                      </div>
                    </Button>
                    <Button
                      variant={favViewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFavViewMode("list")}
                      className="h-8 w-8 p-0"
                      title="List view"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {favViewMode === "grid" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {favorites.map((persona) => (
                      <div
                        key={persona.id}
                        className="flex flex-col items-center text-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => navigateToProfile(persona.persona_id)}
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 relative">
                          {/* Placeholder for avatar */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleFavorite(persona.persona_id, e)}
                            className="absolute -top-2 -right-2 h-6 w-6 text-amber-400 bg-white rounded-full shadow-sm"
                          >
                            <Star className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                        <h3 className="font-semibold text-sm">{persona.name}</h3>
                        <p className="text-xs text-gray-500">{persona.type}</p>
                        <p className="text-xs text-gray-500 truncate max-w-full">{persona.email}</p>
                      </div>
                    ))}
                  </div>
                )}

                {favViewMode === "card" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map((persona) => (
                      <div
                        key={persona.persona_id}
                        className="border rounded-lg p-4 flex justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => navigateToProfile(persona.persona_id)}
                      >
                        <div>
                          <h3 className="font-semibold text-lg">{persona.name}</h3>
                          <p className="text-gray-500">{persona.type}</p>
                          {persona.role && <p>Role: {persona.role}</p>}
                          {persona.department && <p>Dept: {persona.department}</p>}
                          {persona.category && <p>Category: {persona.category}</p>}
                          {persona.investment && <p>Investment: {persona.investment}</p>} 
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => toggleFavorite(persona.persona_id, e)}
                          className="h-8 w-8 text-amber-400"
                        >
                          <Star className="h-5 w-5 fill-current" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                  {favViewMode === "list" && (
                    <div className="space-y-2">
                      {favorites.map((persona) => (
                        <div
                          key={persona.persona_id}  // ✅ Correct key placement
                          className="flex items-center border-b pb-2 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => navigateToProfile(persona.persona_id)} // ✅ Fixed syntax
                        >
                          <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">{persona.name}</h3>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => toggleFavorite(persona.persona_id, e)}
                                className="h-6 w-6 text-amber-400"
                              >
                                <Star className="h-4 w-4 fill-current" />
                              </Button>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Badge variant="outline" className="mr-2">
                                {persona.type}
                              </Badge>
                              <span>{persona.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All Personas Section */}
          <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Personas</h2>
                <div className="text-sm text-gray-500">{sortedPersonas.length} Results</div>
                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === "compact" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("compact")}
                    className="h-8 w-8 p-0"
                    title="Compact view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                    title="Detailed list view"
                  >
                    <div className="flex flex-col gap-0.5 items-center justify-center w-full">
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                      <div className="w-4 h-1 bg-current rounded-sm"></div>
                    </div>
                  </Button>
                </div>
              </div>

              {viewMode === "compact" && (
                <div className="space-y-2">
                  {sortedPersonas.map((persona) => (
                    <div
                      key={persona.persona_id}
                      className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
                      onClick={() => navigateToProfile(persona.persona_id)}
                    >
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full mr-3"></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h3 className="font-semibold truncate">{persona.name}</h3>
                          <Badge variant="outline" className="ml-2">
                            {persona.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{persona.email}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => toggleFavorite(persona.persona_id, e)}
                          className={`h-8 w-8 ${persona.isFavorite ? "text-amber-400" : "text-gray-400"}`}
                        >
                          <Star className={`h-4 w-4 ${persona.isFavorite ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-6">
                  {sortedPersonas.map((persona) => (
                    <div
                      key={persona.persona_id}
                      className="flex items-start border-b pb-4 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => navigateToProfile(persona.persona_id)}
                    >
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold text-lg">{persona.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={persona.type === "Customers" ? "default" : "outline"}>{persona.type}</Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                            >
                              Active
                            </Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => toggleFavorite(persona.persona_id, e)}
                              className={persona.isFavorite ? "text-amber-400" : "text-gray-400"}
                            >
                              <Star className={`h-5 w-5 ${persona.isFavorite ? "fill-current" : ""}`} />
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{persona.email}</p>
                        <p className="text-gray-600 dark:text-gray-400">{persona.phone}</p>
                        <div className="flex justify-between mt-2">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {persona.location}
                          </div>
                          {persona.revenue && (
                            <p className="text-gray-600 dark:text-gray-400">Revenue: {persona.revenue}</p>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Added: {persona.added}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <QuickActions
            onAddPersona={() => setIsAddModalOpen(true)}
            onOpenNotifications={() => setIsNotificationSettingsOpen(true)}
            onScheduleMeeting={() => setIsScheduleMeetingOpen(true)}
            onSendEmail={() => setIsSendEmailOpen(true)}
            onInviteTeamMember={() => setIsInviteTeamMemberOpen(true)}
            onShareDashboard={() => setIsShareDashboardOpen(true)}
            onImportData={() => setIsImportDataOpen(true)}
            onExportData={() => setIsExportDataOpen(true)}
            onGenerateReport={() => setIsGenerateReportOpen(true)}
            onViewAnalytics={() => setIsAnalyticsOpen(true)}
            onBackupData={() => setIsBackupDataOpen(true)}
            onRestoreData={() => setIsRestoreDataOpen(true)}
          />

          {/* Persona Stats */}
          <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Persona Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Personas</span>
                  <span className="font-semibold">{personas.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Favorites</span>
                  <span className="font-semibold">{favorites.length}</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary dark:bg-primary rounded-full"
                    style={{ width: `${favoritedPercentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500">Favorited: {favoritedPercentage}%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Persona Modal */}
      <AddPersonaModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPersona} />

      {/* OCR Persona Capture Modal */}
      <OcrPersonaCapture isOpen={isOcrModalOpen} onClose={() => setIsOcrModalOpen(false)} onAdd={handleAddPersona} />

      {/* Notification Settings Modal */}
      <NotificationSettings isOpen={isNotificationSettingsOpen} onClose={() => setIsNotificationSettingsOpen(false)} />

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onOpenNotifications={() => setIsNotificationSettingsOpen(true)}
      />

      {/* Schedule Meeting Dialog */}
      <ScheduleMeetingDialog isOpen={isScheduleMeetingOpen} onClose={() => setIsScheduleMeetingOpen(false)} />

      {/* Send Email Dialog */}
      <SendEmailDialog isOpen={isSendEmailOpen} onClose={() => setIsSendEmailOpen(false)} />

      {/* Invite Team Member Dialog */}
      <InviteTeamMemberDialog isOpen={isInviteTeamMemberOpen} onClose={() => setIsInviteTeamMemberOpen(false)} />

      {/* Share Dashboard Dialog */}
      <ShareDashboardDialog isOpen={isShareDashboardOpen} onClose={() => setIsShareDashboardOpen(false)} />

      {/* Import Data Dialog */}
      <ImportDataDialog isOpen={isImportDataOpen} onClose={() => setIsImportDataOpen(false)} onImport={(personas) => setPersonas(personas)} />

      {/* Export Data Dialog */}
      <ExportDataDialog isOpen={isExportDataOpen} onClose={() => setIsExportDataOpen(false)} />

      {/* Generate Report Dialog */}
      <GenerateReportDialog isOpen={isGenerateReportOpen} onClose={() => setIsGenerateReportOpen(false)} />

      {/* Analytics Dialog */}
      <AnalyticsDialog isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />

      {/* Backup Data Dialog */}
      <BackupDataDialog isOpen={isBackupDataOpen} onClose={() => setIsBackupDataOpen(false)} />

      {/* Restore Data Dialog */}
      <RestoreDataDialog isOpen={isRestoreDataOpen} onClose={() => setIsRestoreDataOpen(false)} />
    </div>
  </div>
  )
}

