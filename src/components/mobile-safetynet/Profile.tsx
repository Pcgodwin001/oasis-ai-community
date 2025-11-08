import { useState, useEffect } from 'react';
import { User, Mail, Home as HomeIcon, Users as UsersIcon, DollarSign, Edit, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../lib/supabase';
import { userService } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, profile, loading, refreshProfile } = useUser();
  const navigate = useNavigate();

  // Dialog states
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [editHouseholdOpen, setEditHouseholdOpen] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [householdSize, setHouseholdSize] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [childrenCount, setChildrenCount] = useState('');
  const [hasElderly, setHasElderly] = useState(false);
  const [hasDisabled, setHasDisabled] = useState(false);

  // Saving states
  const [saving, setSaving] = useState(false);

  // Load profile data into form fields when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setLocation(profile.location || '');
      setZipCode(profile.zipCode || '');
      setHouseholdSize(profile.householdSize?.toString() || '');
      setMonthlyIncome(profile.monthlyIncome?.toString() || '');
      setChildrenCount(profile.childrenCount?.toString() || '');
      setHasElderly(profile.hasElderly || false);
      setHasDisabled(profile.hasDisabled || false);
    }
  }, [profile]);

  const handleSaveName = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await userService.updateProfile(user.id, { fullName });
      await refreshProfile();
      setEditNameOpen(false);
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await userService.updateProfile(user.id, { location, zipCode });
      await refreshProfile();
      setEditLocationOpen(false);
    } catch (error) {
      console.error('Error saving location:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveHousehold = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await userService.updateProfile(user.id, {
        householdSize: householdSize ? parseInt(householdSize) : null,
        monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome) : null,
        childrenCount: childrenCount ? parseInt(childrenCount) : null,
        hasElderly,
        hasDisabled
      });
      await refreshProfile();
      setEditHouseholdOpen(false);
    } catch (error) {
      console.error('Error saving household info:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-2xl font-semibold">{getInitials(profile.fullName)}</span>
            </div>
            <div>
              <h1 className="text-gray-900 text-lg font-semibold mb-0.5">
                {profile.fullName || 'No name set'}
              </h1>
              <p className="text-gray-600 text-xs">
                Member since {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-gray-900 hover:bg-white/60 h-8 -mt-1"
            onClick={() => setEditNameOpen(true)}
          >
            <Edit className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-sm">Edit</span>
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-900 text-2xl font-semibold mb-0.5">62</p>
            <p className="text-gray-600 text-xs">Health Score</p>
          </div>
          <div className="text-center">
            <p className="text-gray-900 text-2xl font-semibold mb-0.5">$127</p>
            <p className="text-gray-600 text-xs">AI Savings</p>
          </div>
          <div className="text-center">
            <p className="text-gray-900 text-2xl font-semibold mb-0.5">4</p>
            <p className="text-gray-600 text-xs">Days Safe</p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">Contact Information</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-900 hover:bg-white/60 h-7"
            onClick={() => setEditLocationOpen(true)}
          >
            <Edit className="w-3 h-3 mr-1" />
            <span className="text-xs">Edit</span>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <Mail className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-600 text-xs">Email</p>
              <p className="text-gray-900 text-sm font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <HomeIcon className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-600 text-xs">Location</p>
              <p className="text-gray-900 text-sm font-medium">
                {profile.location && profile.zipCode
                  ? `${profile.location}, ${profile.zipCode}`
                  : profile.location || profile.zipCode || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Household Information */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-gray-900 text-base font-semibold">Household Information</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-900 hover:bg-white/60 h-7"
            onClick={() => setEditHouseholdOpen(true)}
          >
            <Edit className="w-3 h-3 mr-1" />
            <span className="text-xs">Edit</span>
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <UsersIcon className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-600 text-xs">Household Size</p>
              <p className="text-gray-900 text-sm font-medium">
                {profile.householdSize ? `${profile.householdSize} people` : 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <div className="flex-1">
              <p className="text-gray-600 text-xs">Monthly Income</p>
              <p className="text-gray-900 text-sm font-medium">
                {profile.monthlyIncome ? `$${profile.monthlyIncome.toLocaleString()}` : 'Not set'}
              </p>
            </div>
          </div>

          {profile.childrenCount !== null && profile.childrenCount > 0 && (
            <div className="flex items-center gap-2.5 p-3 bg-white/40 backdrop-blur-lg rounded-xl border border-white/40">
              <UsersIcon className="w-4 h-4 text-gray-600" />
              <div className="flex-1">
                <p className="text-gray-600 text-xs">Children</p>
                <p className="text-gray-900 text-sm font-medium">{profile.childrenCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-4 border border-white/60">
        <h2 className="text-gray-900 text-base font-semibold mb-3">Financial Overview</h2>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Current Balance</span>
            <span className="text-gray-900 text-sm font-semibold">$156</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Emergency Fund</span>
            <span className="text-gray-900 text-sm font-semibold">$87</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">SNAP Balance</span>
            <span className="text-gray-900 text-sm font-semibold">$296.55</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Monthly Expenses</span>
            <span className="text-gray-900 text-sm font-semibold">
              {profile.monthlyIncome ? `$${profile.monthlyIncome.toLocaleString()}` : '$0'}
            </span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl p-4 text-white">
        <h2 className="text-xl font-semibold mb-3">Achievements</h2>

        <div className="space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-lg rounded-lg">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🎯</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">First Crisis Avoided</p>
              <p className="text-white/80 text-xs">Used ZENO to prevent rent shortage</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-lg rounded-lg">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💰</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Savings Expert</p>
              <p className="text-white/80 text-xs">Found $127/month in savings</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 bg-white/10 backdrop-blur-lg rounded-lg">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🤝</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Community Helper</p>
              <p className="text-white/80 text-xs">Helped 3 families in mutual aid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <Button
        variant="outline"
        className="w-full bg-white/60 hover:bg-white/80 border-white/60"
        onClick={handleSignOut}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>

      {/* Privacy Notice */}
      <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-3 border border-blue-200/40">
        <p className="text-gray-700 text-xs">
          🔒 Your financial data is encrypted and never shared without your permission.
          OASIS is not meant for collecting PII or securing sensitive data.
        </p>
      </div>

      {/* Edit Name Dialog */}
      <Dialog open={editNameOpen} onOpenChange={setEditNameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveName} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Location Dialog */}
      <Dialog open={editLocationOpen} onOpenChange={setEditLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Location</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLocationOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveLocation} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Household Dialog */}
      <Dialog open={editHouseholdOpen} onOpenChange={setEditHouseholdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Household Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="householdSize">Household Size</Label>
              <Input
                id="householdSize"
                type="number"
                min="1"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                placeholder="Number of people"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Income</Label>
              <Input
                id="monthlyIncome"
                type="number"
                min="0"
                step="0.01"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="childrenCount">Number of Children</Label>
              <Input
                id="childrenCount"
                type="number"
                min="0"
                value={childrenCount}
                onChange={(e) => setChildrenCount(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasElderly"
                  checked={hasElderly}
                  onChange={(e) => setHasElderly(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="hasElderly">Has elderly household members</Label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasDisabled"
                  checked={hasDisabled}
                  onChange={(e) => setHasDisabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="hasDisabled">Has disabled household members</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditHouseholdOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHousehold} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
