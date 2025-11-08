import { Link, useLocation } from 'react-router-dom';
import { Home, CreditCard, Bot, MapPin, CheckCircle } from 'lucide-react';
import { Platform } from '../../utils/platform';
import { useHaptics } from '../../hooks/useHaptics';

/**
 * Mobile Bottom Tab Navigation
 * Only visible when running as a native mobile app
 */
export default function BottomNav() {
  const location = useLocation();
  const haptics = useHaptics();
  const isNative = Platform.isNative();

  // Don't show on web
  if (!isNative) return null;

  const tabs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: CreditCard, label: 'Balance', path: '/ebt-balance' },
    { icon: Bot, label: 'NOVA', path: '/nova' },
    { icon: MapPin, label: 'Resources', path: '/resources' },
    { icon: CheckCircle, label: 'Eligible', path: '/eligibility' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleTabPress = () => {
    if (haptics.isAvailable) {
      haptics.light();
    }
  };

  // Calculate safe area padding for devices with home indicator
  const paddingBottom = Platform.getSafeAreaInsets().bottom || 0;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/40 border-t border-white/30 shadow-lg"
      style={{ paddingBottom: `${paddingBottom}px` }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              onClick={handleTabPress}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1 px-2 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-blue-600'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <Icon
                className={`w-6 h-6 mb-1 transition-transform ${
                  active ? 'scale-110' : ''
                }`}
              />
              <span
                className={`text-xs font-medium ${
                  active ? 'font-semibold' : ''
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
