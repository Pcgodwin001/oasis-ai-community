import { useState } from "react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Badge } from "./ui/badge"
import { 
  Home, 
  Building2, 
  Plus, 
  BarChart3, 
  Settings, 
  Users, 
  Trophy,
  FileText,
  Bell,
  LogOut,
  User,
  Shield,
  Briefcase,
  Award,
  Target,
  TestTube,
  Calendar
} from "lucide-react"

interface AppLayoutProps {
  children: React.ReactNode
  currentView: string
  onViewChange: (view: string) => void
}

const navigationItems = [
  {
    title: "Genel",
    items: [
      { title: "Dashboard", icon: Home, id: "dashboard" },
      { title: "Kulüp Yönetimi", icon: Building2, id: "management" },
      { title: "Yeni Kulüp Kayıt", icon: Plus, id: "registration" },
    ]
  },
  {
    title: "Analiz & Raporlar",
    items: [
      { title: "İstatistikler", icon: BarChart3, id: "stats" },
      { title: "Raporlar", icon: FileText, id: "reports" },
      { title: "Kullanıcılar", icon: Users, id: "users" },
    ]
  },
  {
    title: "Sistem",
    items: [
      { title: "Branş Yönetimi", icon: Trophy, id: "sports" },
      { title: "Departman Yönetimi", icon: Briefcase, id: "departments" },
      { title: "Lisans Yönetimi", icon: Award, id: "licenses" },
      { title: "Pozisyon Yönetimi", icon: Target, id: "positions" },
      { title: "Ayarlar", icon: Settings, id: "settings" },
    ]
  },
  {
    title: "Test Yönetimi",
    items: [
      { title: "Test Tanımları", icon: TestTube, id: "tests" },
      { title: "Test Oturumları", icon: Calendar, id: "test-sessions" },
    ]
  }
]

// Mock user data
const currentUser = {
  name: "Ahmet Yılmaz",
  email: "ahmet@sporkulup.gov.tr",
  role: "Sistem Yöneticisi",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  initials: "AY"
}

export function AppLayout({ children, currentView, onViewChange }: AppLayoutProps) {
  const [notifications] = useState(3) // Mock notification count

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r">
          <SidebarContent>
            {/* Logo/Brand */}
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">Spor Kulüp</h2>
                  <p className="text-xs text-muted-foreground">Yönetim Sistemi</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton 
                          onClick={() => onViewChange(item.id)}
                          isActive={currentView === item.id}
                          className="w-full"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}

            {/* User Info in Sidebar */}
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-between h-full px-6">
              {/* Left side */}
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div>
                  <h1 className="font-semibold text-foreground">
                    {navigationItems
                      .flatMap(group => group.items)
                      .find(item => item.id === currentView)?.title || "Dashboard"}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Spor Kulüpleri Yönetim Sistemi
                  </p>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.initials}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                        <div className="flex items-center gap-1 pt-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{currentUser.role}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Ayarlar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Bildirimler</span>
                      {notifications > 0 && (
                        <Badge variant="secondary" className="ml-auto h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {notifications}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Çıkış Yap</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}