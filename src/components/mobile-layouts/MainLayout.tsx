import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, TrendingUp, Users, User, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import {
  MapPin,
  Briefcase,
  ScanLine,
  CreditCard,
  ShieldAlert,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function MainLayout() {
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/budget', icon: TrendingUp, label: 'Budget' },
    { path: '/zeno', icon: Sparkles, label: 'Start', isCenter: true },
    { path: '/community', icon: Users, label: 'Community' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const moreMenuItems = [
    { path: '/scan', icon: ScanLine, label: 'Scan Receipt', description: 'Find cheaper alternatives' },
    { path: '/jobs', icon: Briefcase, label: 'Find Work', description: 'Income opportunities' },
    { path: '/resources', icon: MapPin, label: 'Resources', description: 'Food banks & assistance' },
    { path: '/ebt', icon: CreditCard, label: 'Benefits', description: 'Track SNAP & programs' },
    { path: '/shutdown', icon: ShieldAlert, label: 'Shutdown Tracker', description: 'Monitor risks' },
    { path: '/settings', icon: SettingsIcon, label: 'Settings', description: 'Account & preferences' },
    { path: '/help', icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 pb-24">
      {/* Top Header with Menu */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between" style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top))' }}>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white hover:bg-gray-100 rounded-xl"
              >
                <Menu className="w-5 h-5 text-gray-900" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-white/95 backdrop-blur-xl border-r border-white/60 p-0">
              <div className="px-6 pb-4" style={{ paddingTop: 'calc(3rem + env(safe-area-inset-top))' }}>
                <SheetTitle className="text-gray-900 mb-1">Menu</SheetTitle>
                <SheetDescription className="text-gray-600 text-sm">Quick access to all features</SheetDescription>
              </div>
              
              <div className="px-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-200px)]">
                {moreMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSheetOpen(false)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                          : 'bg-white/60 hover:bg-white/80 text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-xs ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="px-6 py-6 mt-auto border-t border-white/60">
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 transition-all w-full text-left text-rose-600"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-6" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Elevated Center Button */}
          <Link
            to="/zeno"
            className="absolute left-1/2 -translate-x-1/2 -top-6 flex flex-col items-center transition-all z-10"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                location.pathname === '/zeno'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-600 scale-110'
                  : 'bg-gradient-to-br from-blue-500 to-cyan-600 hover:scale-105'
              }`}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className={`text-[10px] mt-0.5 font-medium ${location.pathname === '/zeno' ? 'text-blue-600' : 'text-gray-600'}`}>
              Start
            </span>
          </Link>

          {/* Navigation Bar */}
          <div>
            <div className="flex items-center h-16">
              {navItems.map((item, index) => {
                if (item.isCenter) {
                  // Reserve space for center button
                  return <div key="spacer" className="flex-1" />;
                }
                
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
