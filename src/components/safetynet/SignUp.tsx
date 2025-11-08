import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Mail, Lock, User, Phone, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { Progress } from '../ui/progress';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { toast } from 'sonner';
import oasisLogo from 'figma:asset/fe6c3ee5b4ff23915f06469b49dec7bb4e9b188a.png';

interface SignUpProps {
  onSignUp: () => void;
}

export default function SignUp({ onSignUp }: SignUpProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    householdSize: '',
    zipCode: '',
    agreedToTerms: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = async () => {
    setError('');

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    // Final step - create account
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Create account
      const { user, error: authError } = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName
      );

      if (authError || !user) {
        setError(authError?.message || 'Failed to create account');
        toast.error('Sign up failed');
        setIsLoading(false);
        return;
      }

      // Update profile with additional info
      await userService.updateProfile(user.id, {
        id: user.id,
        fullName: formData.fullName,
        householdSize: formData.householdSize ? parseInt(formData.householdSize) : null,
        zipCode: formData.zipCode || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: null,
        monthlyIncome: null,
        childrenCount: null,
        hasElderly: null,
        hasDisabled: null
      });

      toast.success('Account created successfully!');
      onSignUp();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      toast.error('Sign up failed');
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-gray-50 to-cyan-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-2xl relative">
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-3xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img src={oasisLogo} alt="Oasis" className="w-64 h-auto" />
            </div>
            <h1 className="text-gray-900 mb-2">Create Your Account</h1>
            <p className="text-gray-600">Join Oasis and get personalized assistance</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Step {step} of {totalSteps}</span>
              <span className="text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Account Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                  />
                </div>
                <p className="text-gray-500">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Household Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="householdSize">Household Size</Label>
                <Input
                  id="householdSize"
                  type="number"
                  placeholder="Number of people in your household"
                  value={formData.householdSize}
                  onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Your ZIP code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="cursor-pointer leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              type="button"
              onClick={handleNext}
              className="backdrop-blur-lg bg-white/60 hover:bg-white/80 border border-white/60 text-gray-900 shadow-lg transition-all duration-300"
            >
              {step === totalSteps ? 'Create Account' : 'Next'}
              {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
