import { useState, ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, CreditCard, Bot, MapPin, AlertTriangle, 
  DollarSign, Receipt, Briefcase, Users, CheckCircle, 
  Bus, Settings, Menu, X, Bell, Search, User, ChevronLeft,
  ChevronRight, LogOut
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import oasisLogo from 'figma:asset/fe6c3ee5b4ff23915f06469b49dec7bb4e9b188a.png';

interface MainLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: CreditCard, label: 'EBT Balance', path: '/ebt-balance' },
  { icon: Bot, label: 'NOVA', path: '/nova' },
  { icon: MapPin, label: 'Find Resources', path: '/resources' },
  { icon: AlertTriangle, label: 'Shutdown Tracker', path: '/shutdown' },
  { icon: DollarSign, label: 'Budget Guide', path: '/budget' },
  { icon: Receipt, label: 'Receipt Scanner', path: '/receipts' },
  { icon: Briefcase, label: 'Job Search', path: '/jobs' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: CheckCircle, label: 'Eligibility Check', path: '/eligibility' },
  { icon: Bus, label: 'Transportation', path: '/transportation' },
];

export default function MainLayout({ children, onLogout }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-blue-50/40 via-gray-50 to-cyan-50/30 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-200/15 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col backdrop-blur-xl bg-white/30 border-r border-white/40 transition-all duration-500 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/30">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <img src={oasisLogo} alt="Oasis" className="h-12 w-auto" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="mx-auto"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="p-4 border-b border-white/30">
            <div className="flex items-center space-x-3 backdrop-blur-md bg-white/20 rounded-xl p-3 border border-white/40">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="backdrop-blur-lg bg-white/60 text-gray-900 border border-white/60">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 truncate">John Doe</p>
                <p className="text-gray-600 truncate">Jackson, TN</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ease-out ${
                    isActive(item.path)
                      ? 'backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 shadow-lg border border-blue-400/40 transform scale-105'
                      : 'text-gray-700 hover:backdrop-blur-md hover:bg-blue-50/30 hover:border hover:border-blue-400/20'
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Settings & Logout */}
        <div className="p-3 border-t border-white/30 space-y-1">
          <Link
            to="/settings"
            className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ease-out ${
              isActive('/settings')
                ? 'backdrop-blur-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 shadow-lg border border-blue-400/40'
                : 'text-gray-700 hover:backdrop-blur-md hover:bg-blue-50/30 hover:border hover:border-blue-400/20'
            }`}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:backdrop-blur-md hover:bg-red-50/30 hover:border hover:border-red-400/20 transition-all duration-300"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-72 backdrop-blur-xl bg-white/40 border-r border-white/40 z-50 transform transition-all duration-500 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/30">
          <div className="flex items-center space-x-3">
            <img src={oasisLogo} alt="Oasis" className="h-12 w-auto" />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-white/30">
          <div className="flex items-center space-x-3 backdrop-blur-md bg-white/20 rounded-xl p-3 border border-white/40">
            <Avatar>
              <AvatarFallback className="backdrop-blur-lg bg-white/60 text-gray-900 border border-white/60">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-gray-900">John Doe</p>
              <p className="text-gray-600">Jackson, TN</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)] px-3 py-4">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-300 ease-out ${
                    isActive(item.path)
                      ? 'backdrop-blur-lg bg-white/60 text-gray-900 shadow-lg border border-white/60'
                      : 'text-gray-700 hover:backdrop-blur-md hover:bg-white/30 hover:border hover:border-white/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t border-white/30 space-y-1">
          <Link
            to="/settings"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:backdrop-blur-md hover:bg-white/30 hover:border hover:border-white/40 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onLogout();
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-gray-700 hover:backdrop-blur-md hover:bg-white/30 hover:border hover:border-white/40 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 backdrop-blur-xl bg-white/30 border-b border-white/40 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="hidden md:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <Input
                  placeholder="Search resources, benefits, jobs..."
                  className="pl-10 w-full backdrop-blur-lg bg-white/60 border-blue-400/30 focus:border-blue-500/50 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500">
                3
              </Badge>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="backdrop-blur-lg bg-white/60 text-gray-900 border border-white/60">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
