import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'sonner';
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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => setIsAuthenticated(true)} />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/" /> : <SignUp onSignUp={() => setIsAuthenticated(true)} />} 
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout onLogout={() => setIsAuthenticated(false)}>
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
    </Router>
  );
}
