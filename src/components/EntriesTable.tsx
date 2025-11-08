import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, DollarSign } from "lucide-react"

const entries = [
  {
    id: "PRJ-001",
    name: "Website Redesign",
    client: "Acme Corp",
    status: "In Progress",
    priority: "High",
    assignee: {
      name: "Sarah Wilson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face",
      initials: "SW"
    },
    dueDate: "2024-08-15",
    budget: "$45,000",
    progress: 65,
    lastUpdated: "2 hours ago"
  },
  {
    id: "PRJ-002",
    name: "Mobile App Development",
    client: "TechStart Inc",
    status: "Planning",
    priority: "Medium",
    assignee: {
      name: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      initials: "MJ"
    },
    dueDate: "2024-09-30",
    budget: "$120,000",
    progress: 15,
    lastUpdated: "1 day ago"
  },
  {
    id: "PRJ-003",
    name: "Database Migration",
    client: "Global Systems",
    status: "Completed",
    priority: "High",
    assignee: {
      name: "Emily Chen",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      initials: "EC"
    },
    dueDate: "2024-07-20",
    budget: "$25,000",
    progress: 100,
    lastUpdated: "3 days ago"
  },
  {
    id: "PRJ-004",
    name: "API Integration",
    client: "DataFlow Ltd",
    status: "In Progress",
    priority: "Low",
    assignee: {
      name: "David Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      initials: "DB"
    },
    dueDate: "2024-08-25",
    budget: "$15,000",
    progress: 40,
    lastUpdated: "4 hours ago"
  },
  {
    id: "PRJ-005",
    name: "Security Audit",
    client: "SecureBank",
    status: "Review",
    priority: "High",
    assignee: {
      name: "Lisa Rodriguez",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face",
      initials: "LR"
    },
    dueDate: "2024-08-10",
    budget: "$30,000",
    progress: 90,
    lastUpdated: "6 hours ago"
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    "Completed": "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    "Planning": "bg-yellow-100 text-yellow-800",
    "Review": "bg-purple-100 text-purple-800",
    "On Hold": "bg-gray-100 text-gray-800",
  }
  return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

const getPriorityBadge = (priority: string) => {
  const variants = {
    "High": "bg-red-100 text-red-800",
    "Medium": "bg-orange-100 text-orange-800",
    "Low": "bg-green-100 text-green-800",
  }
  return variants[priority as keyof typeof variants] || "bg-gray-100 text-gray-800"
}

export function EntriesTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>
              Manage and track your active projects
            </CardDescription>
          </div>
          <Button>View All Projects</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">{entry.id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{entry.client}</div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={getStatusBadge(entry.status)}
                  >
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={getPriorityBadge(entry.priority)}
                  >
                    {entry.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={entry.assignee.avatar} alt={entry.assignee.name} />
                      <AvatarFallback>{entry.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{entry.assignee.name}</div>
                      <div className="text-sm text-muted-foreground">Updated {entry.lastUpdated}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {entry.dueDate}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    {entry.budget}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2 max-w-[80px]">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${entry.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{entry.progress}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}