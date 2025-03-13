"use client"

import { useState } from "react"
import {
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Share2,
  Maximize2,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
} from "recharts"

interface AnalyticsDialogProps {
  isOpen: boolean
  onClose: () => void
}

// Sample data for charts
const personaGrowthData = [
  { name: "Jan", employees: 40, vendors: 24, customers: 35, investors: 20 },
  { name: "Feb", employees: 45, vendors: 25, customers: 38, investors: 22 },
  { name: "Mar", employees: 50, vendors: 28, customers: 42, investors: 24 },
  { name: "Apr", employees: 55, vendors: 30, customers: 45, investors: 25 },
  { name: "May", employees: 60, vendors: 32, customers: 48, investors: 28 },
  { name: "Jun", employees: 65, vendors: 35, customers: 52, investors: 30 },
  { name: "Jul", employees: 70, vendors: 38, customers: 55, investors: 32 },
  { name: "Aug", employees: 75, vendors: 40, customers: 58, investors: 35 },
  { name: "Sep", employees: 80, vendors: 42, customers: 62, investors: 38 },
  { name: "Oct", employees: 85, vendors: 45, customers: 65, investors: 40 },
  { name: "Nov", employees: 90, vendors: 48, customers: 68, investors: 42 },
  { name: "Dec", employees: 95, vendors: 50, customers: 72, investors: 45 },
]

const typeDistributionData = [
  { name: "Employees", value: 524, color: "#3b82f6" },
  { name: "Customers", value: 349, color: "#22c55e" },
  { name: "Vendors", value: 225, color: "#a855f7" },
  { name: "Investors", value: 150, color: "#f59e0b" },
]

const activityData = [
  { name: "Week 1", interactions: 120 },
  { name: "Week 2", interactions: 150 },
  { name: "Week 3", interactions: 180 },
  { name: "Week 4", interactions: 170 },
  { name: "Week 5", interactions: 200 },
  { name: "Week 6", interactions: 220 },
  { name: "Week 7", interactions: 240 },
  { name: "Week 8", interactions: 230 },
  { name: "Week 9", interactions: 250 },
  { name: "Week 10", interactions: 270 },
  { name: "Week 11", interactions: 290 },
  { name: "Week 12", interactions: 310 },
]

const locationData = [
  { name: "New York", value: 350, color: "#3b82f6" },
  { name: "San Francisco", value: 280, color: "#22c55e" },
  { name: "Chicago", value: 200, color: "#a855f7" },
  { name: "Austin", value: 170, color: "#f59e0b" },
  { name: "Seattle", value: 150, color: "#ec4899" },
  { name: "Other", value: 98, color: "#64748b" },
]

export default function AnalyticsDialog({ isOpen, onClose }: AnalyticsDialogProps) {
  const [timeRange, setTimeRange] = useState("30days")
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    setIsLoading(true)
    // Simulate data loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  const exportData = () => {
    alert("Analytics data would be exported in a real application")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>

            <Button variant="outline" size="icon" onClick={exportData}>
              <Download className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personas" className="mt-4">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="personas">
              <Users className="h-4 w-4 mr-2" />
              Personas
            </TabsTrigger>
            <TabsTrigger value="growth">
              <LineChart className="h-4 w-4 mr-2" />
              Growth
            </TabsTrigger>
            <TabsTrigger value="distribution">
              <PieChart className="h-4 w-4 mr-2" />
              Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personas" className="space-y-4 mt-4">
            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading analytics data...</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,248</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+12.5%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Personas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">842</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+5.2%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">67.4%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-500">-2.1%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="col-span-1 lg:col-span-2 bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>Persona Growth</CardTitle>
                        <CardDescription>Monthly growth of personas by type</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={personaGrowthData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="employees" fill="#3b82f6" name="Employees" />
                            <Bar dataKey="vendors" fill="#a855f7" name="Vendors" />
                            <Bar dataKey="customers" fill="#22c55e" name="Customers" />
                            <Bar dataKey="investors" fill="#f59e0b" name="Investors" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle>Type Distribution</CardTitle>
                      <CardDescription>Breakdown by persona type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={typeDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {typeDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-4 mt-4">
                        {typeDistributionData.map((item) => (
                          <div className="space-y-2" key={item.name}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge style={{ backgroundColor: item.color }}>{item.name}</Badge>
                                <span className="text-sm">{Math.round((item.value / 1248) * 100)}%</span>
                              </div>
                              <span className="text-sm font-medium">{item.value}</span>
                            </div>
                            <Progress
                              value={Math.round((item.value / 1248) * 100)}
                              className="h-2"
                              indicatorClassName="bg-primary"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle>Activity Over Time</CardTitle>
                      <CardDescription>Interaction frequency trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ReLineChart
                            data={activityData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="interactions"
                              stroke="#3b82f6"
                              activeDot={{ r: 8 }}
                              name="Interactions"
                            />
                          </ReLineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="growth" className="mt-4">
            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading growth data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">New Personas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">124</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+18.3%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">9.8%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+2.1%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">92.4%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-green-500">+0.8%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">7.6%</div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-red-500">-0.8%</span> from last month
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Growth Analytics</CardTitle>
                      <CardDescription>Detailed growth metrics over time</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReLineChart
                          data={personaGrowthData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="employees"
                            stroke="#3b82f6"
                            activeDot={{ r: 8 }}
                            name="Employees"
                          />
                          <Line type="monotone" dataKey="vendors" stroke="#a855f7" name="Vendors" />
                          <Line type="monotone" dataKey="customers" stroke="#22c55e" name="Customers" />
                          <Line type="monotone" dataKey="investors" stroke="#f59e0b" name="Investors" />
                        </ReLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="distribution" className="mt-4">
            {isLoading ? (
              <div className="h-[500px] flex flex-col items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin mb-4 text-primary" />
                <p>Loading distribution data...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>Distribution by Type</CardTitle>
                        <CardDescription>Persona distribution by type</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={typeDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {typeDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div>
                        <CardTitle>Distribution by Location</CardTitle>
                        <CardDescription>Persona distribution by location</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={locationData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {locationData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card dark:bg-card text-card-foreground dark:text-card-foreground">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Detailed Distribution Analytics</CardTitle>
                      <CardDescription>Breakdown by various attributes</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Department Distribution</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Engineering</span>
                            <span>35%</span>
                          </div>
                          <Progress value={35} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Marketing</span>
                            <span>25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Sales</span>
                            <span>20%</span>
                          </div>
                          <Progress value={20} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Operations</span>
                            <span>15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Other</span>
                            <span>5%</span>
                          </div>
                          <Progress value={5} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Role Distribution</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Manager</span>
                            <span>22%</span>
                          </div>
                          <Progress value={22} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Developer</span>
                            <span>30%</span>
                          </div>
                          <Progress value={30} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Designer</span>
                            <span>15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Analyst</span>
                            <span>18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Other</span>
                            <span>15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Status Distribution</h3>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Active</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Inactive</span>
                            <span>15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Pending</span>
                            <span>10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button type="button" onClick={exportData}>
            Export Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

