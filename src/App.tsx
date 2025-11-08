import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { UserProvider, useUser } from './contexts/UserContext';
import Login from './components/safetynet/Login';
import SignUp from './components/safetynet/SignUp';
import MainLayout from './components/safetynet/MainLayout';
import Dashboard from './components/safetynet/Dashboard';
import EBTBalance from './components/safetynet/EBTBalance';
import NovaChat from './components/safetynet/NovaChat';
import ResourceMap from './components/safetynet/ResourceMap';
import ShutdownTracker from './components/safetynet/ShutdownTracker';
import BudgetGuide from './components/safetynet/BudgetGuide';
import ReceiptScanner from './components/safetynet/ReceiptScanner';
import JobSearch from './components/safetynet/JobSearch';
import Community from './components/safetynet/Community';
import EligibilityChecker from './components/safetynet/EligibilityChecker';
import Transportation from './components/safetynet/Transportation';
import Settings from './components/safetynet/Settings';

function AppRoutes() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
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
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ebt-balance" element={<EBTBalance />} />
                <Route path="/nova" element={<NovaChat />} />
                <Route path="/resources" element={<ResourceMap />} />
                <Route path="/shutdown" element={<ShutdownTracker />} />
                <Route path="/budget" element={<BudgetGuide />} />
                <Route path="/receipts" element={<ReceiptScanner />} />
                <Route path="/jobs" element={<JobSearch />} />
                <Route path="/community" element={<Community />} />
                <Route path="/eligibility" element={<EligibilityChecker />} />
                <Route path="/transportation" element={<Transportation />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Router>
        <Toaster position="top-right" />
        <AppRoutes />
      </Router>
    </UserProvider>
  );
}
