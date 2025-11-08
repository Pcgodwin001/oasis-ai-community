import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { UserProvider, useUser } from './contexts/UserContext';

// Lazy load components for better performance
const Login = lazy(() => import('./components/mobile-auth/Login'));
const SignUp = lazy(() => import('./components/mobile-auth/SignUp'));
const MainLayout = lazy(() => import('./components/mobile-layouts/MainLayout'));
const Dashboard = lazy(() => import('./components/mobile-safetynet/Dashboard'));
const ZenoChat = lazy(() => import('./components/mobile-safetynet/ZenoChat'));
const BudgetGuide = lazy(() => import('./components/mobile-safetynet/BudgetGuide'));
const ReceiptScanner = lazy(() => import('./components/mobile-safetynet/ReceiptScanner'));
const EBTBalance = lazy(() => import('./components/mobile-safetynet/EBTBalance'));
const ShutdownTracker = lazy(() => import('./components/mobile-safetynet/ShutdownTracker'));
const JobSearch = lazy(() => import('./components/mobile-safetynet/JobSearch'));
const ResourceMap = lazy(() => import('./components/mobile-safetynet/ResourceMap'));
const Community = lazy(() => import('./components/mobile-safetynet/Community'));
const Settings = lazy(() => import('./components/mobile-safetynet/Settings'));
const Profile = lazy(() => import('./components/mobile-safetynet/Profile'));

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="zeno" element={<ZenoChat />} />
                  <Route path="budget" element={<BudgetGuide />} />
                  <Route path="scan" element={<ReceiptScanner />} />
                  <Route path="ebt" element={<EBTBalance />} />
                  <Route path="shutdown" element={<ShutdownTracker />} />
                  <Route path="jobs" element={<JobSearch />} />
                  <Route path="resources" element={<ResourceMap />} />
                  <Route path="community" element={<Community />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="help" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Suspense>
  );
}

export default function MobileApp() {
  return (
    <UserProvider>
      <Router>
        <Toaster position="top-center" />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}
