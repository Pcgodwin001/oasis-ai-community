import { Settings as SettingsIcon, User, Bell, Lock, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

export default function Settings() {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', action: 'edit' },
        { icon: Lock, label: 'Privacy & Security', action: 'edit' },
      ],
    },
    {
      title: 'Notifications',
      items: [
        { icon: Bell, label: 'Crisis Alerts', action: 'toggle', enabled: true },
        { icon: Bell, label: 'Shutdown Updates', action: 'toggle', enabled: true },
        { icon: Bell, label: 'Savings Opportunities', action: 'toggle', enabled: true },
        { icon: Bell, label: 'Community Messages', action: 'toggle', enabled: false },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: 'link' },
        { icon: FileText, label: 'Terms of Service', action: 'link' },
        { icon: FileText, label: 'Privacy Policy', action: 'link' },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl">Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl">S</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-900 text-xl">Sarah Johnson</p>
            <p className="text-gray-600">sarah.j@email.com</p>
          </div>
          <Button variant="outline" className="bg-white/60 border-white/60 hover:bg-white/80">
            Edit
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIdx) => (
        <div key={sectionIdx} className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
          <h2 className="text-gray-900 text-xl mb-4">{section.title}</h2>
          
          <div className="space-y-1">
            {section.items.map((item, itemIdx) => {
              const Icon = item.icon;
              
              return (
                <div
                  key={itemIdx}
                  className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-lg rounded-2xl border border-white/40 hover:bg-white/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  
                  {item.action === 'toggle' ? (
                    <Switch defaultChecked={item.enabled} />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quick Links */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h2 className="text-gray-900 text-xl mb-4">Quick Links</h2>
        
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start bg-white/40 border-white/40 hover:bg-white/60">
            <HelpCircle className="w-5 h-5 mr-3" />
            Help & Support
          </Button>

          <Button variant="outline" className="w-full justify-start bg-white/40 border-white/40 hover:bg-white/60">
            <FileText className="w-5 h-5 mr-3" />
            About OASIS
          </Button>

          <Button variant="outline" className="w-full justify-start bg-white/40 border-white/40 hover:bg-white/60 text-rose-600">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* App Version */}
      <div className="text-center text-gray-600 text-sm pb-4">
        <p>OASIS v1.0.0</p>
        <p>Enhance Quality of Life</p>
      </div>
    </div>
  );
}
