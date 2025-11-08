import { Search, Plus, Bell, Settings, User, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function TopNavigation() {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo and Navigation Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-medium">D</span>
            </div>
            <span className="font-medium">Dashboard</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Overview
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Projects
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Reports
            </a>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search projects..."
              className="pl-10 w-80"
            />
          </div>
          
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">John Doe</p>
                  <p className="text-muted-foreground">john@example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}