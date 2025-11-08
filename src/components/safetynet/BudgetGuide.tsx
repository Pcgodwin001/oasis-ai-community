import { DollarSign, TrendingDown, ShoppingCart, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

export default function BudgetGuide() {
  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Smart Budget Guide</h1>
        <p className="text-gray-600">AI-powered recommendations to stretch your benefits further</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-gray-600 mb-1">Current Balance</p>
            <p className="text-gray-900">$296.55</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <TrendingDown className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-gray-600 mb-1">Daily Budget</p>
            <p className="text-gray-900">$14.83</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <ShoppingCart className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-gray-600 mb-1">Avg Spending</p>
            <p className="text-gray-900">$42.36/day</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Lightbulb className="w-8 h-8 text-yellow-600 mb-3" />
            <p className="text-gray-600 mb-1">Savings Tips</p>
            <p className="text-gray-900">12 available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Personalized tips based on your spending patterns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-900 mb-2">💰 Save $45/month by shopping at Aldi</p>
            <p className="text-gray-600">
              Based on your purchases, switching to Aldi for staples could save you approximately $45 per month.
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-gray-900 mb-2">🥗 Meal planning can save $60/month</p>
            <p className="text-gray-600">
              Planning meals in advance reduces impulse purchases and food waste.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-gray-900 mb-2">🛒 Buy generic brands for 30% savings</p>
            <p className="text-gray-600">
              Generic brands offer the same quality at lower prices for most items.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Meal Planner</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Plan your meals for the week to stay on budget</p>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
            Create Meal Plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
