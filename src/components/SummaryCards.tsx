import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Clock, CheckCircle, AlertCircle, Calendar, Zap, Star } from "lucide-react"

export function SummaryCards() {
  const summaryData = [
    {
      title: "Tasks Completed Today",
      value: "24",
      description: "8 more than yesterday",
      icon: CheckCircle,
      progress: 75,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Pending Reviews",
      value: "12",
      description: "3 urgent items",
      icon: Clock,
      progress: 40,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Overdue Items",
      value: "5",
      description: "Requires attention",
      icon: AlertCircle,
      progress: 20,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Upcoming Deadlines",
      value: "18",
      description: "Next 7 days",
      icon: Calendar,
      progress: 60,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  const quickStats = [
    {
      label: "Team Performance",
      value: "94%",
      trend: "+5.2%",
      icon: Star,
    },
    {
      label: "System Uptime",
      value: "99.9%",
      trend: "+0.1%",
      icon: Zap,
    },
    {
      label: "Client Satisfaction",
      value: "4.8",
      trend: "+0.3",
      icon: Star,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Summary Overview</h2>
        <Badge variant="outline">Updated 5 minutes ago</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryData.map((item, index) => {
          const Icon = item.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <Icon className={`h-4 w-4 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                <div className="mt-3">
                  <Progress value={item.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{item.progress}% complete</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>Key performance indicators at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-full">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{stat.label}</p>
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}