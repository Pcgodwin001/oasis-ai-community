import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export default function EligibilityChecker() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    householdSize: '',
    monthlyIncome: '',
    children: '',
    elderly: false,
    disabled: false,
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-gray-900 mb-2">Eligibility Checker</h1>
        <p className="text-gray-600">See which programs you may qualify for</p>
      </div>

      {step <= totalSteps ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Step {step} of {totalSteps}</span>
              <span className="text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2 mb-4" />
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="householdSize">Household Size</Label>
                  <Input
                    id="householdSize"
                    type="number"
                    placeholder="Number of people in household"
                    value={formData.householdSize}
                    onChange={(e) => setFormData({ ...formData, householdSize: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="children">Number of Children</Label>
                  <Input
                    id="children"
                    type="number"
                    placeholder="Children under 18"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="monthlyIncome">Monthly Household Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="Total monthly income before taxes"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                  />
                  <p className="text-gray-500 mt-2">Include all sources: wages, benefits, etc.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-gray-700">Additional Information (optional)</p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.elderly}
                      onChange={(e) => setFormData({ ...formData, elderly: e.target.checked })}
                      className="rounded"
                    />
                    <span>Household includes elderly (60+)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.disabled}
                      onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                      className="rounded"
                    />
                    <span>Household includes disabled individual</span>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  if (step < totalSteps) {
                    setStep(step + 1);
                  } else {
                    setStep(totalSteps + 1);
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {step === totalSteps ? 'Check Eligibility' : 'Next'}
                {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h2 className="text-gray-900 mb-4">Your Eligibility Results</h2>
              <p className="text-gray-600">
                Based on your household size of {formData.householdSize} and monthly income of ${formData.monthlyIncome}:
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">SNAP / EBT - Eligible</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <div>
                <p className="text-gray-600">Estimated Monthly Benefit</p>
                <p className="text-gray-900">$425 - $550</p>
              </div>
              <p className="text-gray-600">
                You appear to qualify for SNAP benefits. Your estimated benefit amount is based on household size and income.
              </p>
              <Button className="bg-gradient-to-r from-green-600 to-green-700">
                Start Application →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-green-50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-900">WIC - Likely Eligible</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-gray-600">
                With {formData.children} children, you likely qualify for WIC benefits including nutrition assistance for pregnant women, new mothers, and children under 5.
              </p>
              <Button className="bg-gradient-to-r from-green-600 to-green-700">
                Learn More →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-yellow-50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
                <CardTitle className="text-yellow-900">TANF - May Qualify</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <p className="text-gray-600">
                You may qualify for Temporary Assistance for Needy Families. Additional requirements apply.
              </p>
              <Button variant="outline">Check Requirements →</Button>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setStep(1)}>
              Start Over
            </Button>
            <Button>Download Results</Button>
            <Button variant="outline">Email Results</Button>
          </div>
        </div>
      )}
    </div>
  );
}
