import { ShaderAnimation } from "@/components/ui/shader-animation";
import { Card } from "@/components/ui/card";
import { Spotlight } from "@/components/ui/spotlight-aceternity";
import { SplineScene } from "@/components/ui/splite";
import { Brain, Shield, Map, Calendar, DollarSign, Briefcase, AlertTriangle, Receipt } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Shader Animation */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ShaderAnimation />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50">
            Predict Your Financial Crisis
            <br />
            Before It Happens
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            OASIS uses AI to help families in poverty navigate government benefits,
            predict financial shortfalls, and access emergency resources—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
              Download for iOS
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-lg font-semibold border border-white/20 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            The Challenge We're Solving
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Government Disruptions</h3>
              <p className="text-zinc-300">
                40% of Jackson, TN lives in poverty. Government shutdowns cut off SNAP benefits
                with no warning, creating instant food insecurity.
              </p>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <DollarSign className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Complex Benefits</h3>
              <p className="text-zinc-300">
                Families miss out on $2,847+ annually in benefits they qualify for
                because navigating SNAP, WIC, TANF, and LIHEAP is too complex.
              </p>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700 p-6">
              <Calendar className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">No Early Warning</h3>
              <p className="text-zinc-300">
                Families can't predict when they'll run out of money. No system exists
                to warn about financial crises before they happen.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* NOVA AI Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet NOVA
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Your AI Financial Coach
                </span>
              </h2>
              <p className="text-xl text-zinc-300 mb-6">
                Available 24/7, NOVA is more than a chatbot—it's your personal financial advisor
                that understands your unique situation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Predictive Intelligence:</strong> Warns you about
                    financial crises days or weeks before they happen
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Personalized Guidance:</strong> Uses your EBT balance,
                    household size, and location for contextual advice
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-zinc-300">
                    <strong className="text-white">Shutdown Alerts:</strong> Monitors government shutdown risks
                    and helps you prepare in advance
                  </span>
                </li>
              </ul>
            </div>

            <Card className="bg-black/[0.96] border-zinc-700 h-[500px] relative overflow-hidden">
              <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
              />
              <div className="p-8 relative z-10 h-full flex flex-col justify-center">
                <div className="bg-zinc-800/50 rounded-lg p-4 mb-4 border border-zinc-700">
                  <p className="text-sm text-zinc-400 mb-2">You:</p>
                  <p className="text-white">When will I run out of money?</p>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                  <p className="text-sm text-blue-400 mb-2">NOVA:</p>
                  <p className="text-white">
                    Based on your current EBT balance of $156 and your household's typical spending,
                    you'll likely run out in 4 days (Nov 12). Here's what I recommend:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    <li>• Visit Second Harvest Food Bank today (open until 5pm)</li>
                    <li>• Budget $39/day to stretch until your next deposit</li>
                    <li>• You may qualify for emergency TANF assistance</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-900 to-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            Everything You Need to Survive Economic Uncertainty
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<DollarSign className="w-8 h-8" />}
              title="EBT Balance Tracker"
              description="Real-time balance, transaction history, and daily budget calculator with low balance warnings"
              color="blue"
            />

            <FeatureCard
              icon={<Map className="w-8 h-8" />}
              title="Food Resource Map"
              description="Find food banks, pantries, and soup kitchens with real-time inventory and wait times"
              color="green"
            />

            <FeatureCard
              icon={<AlertTriangle className="w-8 h-8" />}
              title="Shutdown Risk Monitor"
              description="Track government shutdown probability and prepare before SNAP benefits are disrupted"
              color="orange"
            />

            <FeatureCard
              icon={<Receipt className="w-8 h-8" />}
              title="Smart Receipt Scanner"
              description="AI-powered expense tracking with price comparisons and savings recommendations"
              color="purple"
            />

            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Benefit Eligibility"
              description="Discover programs you qualify for: SNAP, WIC, TANF, LIHEAP, and more"
              color="cyan"
            />

            <FeatureCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Job Search Helper"
              description="Find local jobs with AI-powered application assistance and resume building"
              color="pink"
            />

            <FeatureCard
              icon={<Calendar className="w-8 h-8" />}
              title="Budget Calculator"
              description="Smart daily budgets based on your balance, household size, and spending patterns"
              color="yellow"
            />

            <FeatureCard
              icon={<Brain className="w-8 h-8" />}
              title="Crisis Prediction"
              description="Get warned days in advance about potential financial emergencies"
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            Real Impact for Real Families
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                15,000+
              </div>
              <p className="text-zinc-400">Families in Jackson could benefit</p>
            </div>

            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-500 mb-2">
                $150
              </div>
              <p className="text-zinc-400">Average saved per month through optimization</p>
            </div>

            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 mb-2">
                7+ days
              </div>
              <p className="text-zinc-400">Early warning for shutdown disruptions</p>
            </div>

            <div>
              <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                2+ hours
              </div>
              <p className="text-zinc-400">Saved weekly vs. manual checking</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Interactive Section */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden">
            <Spotlight
              className="-top-40 left-0 md:left-60 md:-top-20"
              fill="white"
            />

            <div className="flex h-full flex-col md:flex-row">
              {/* Left content */}
              <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 mb-4">
                  Built for Jackson
                  <br />
                  Scalable Nationwide
                </h2>
                <p className="text-neutral-300 max-w-lg">
                  Starting in Jackson, Tennessee—where 40% live in poverty—but designed
                  to help the 38 million Americans facing economic hardship.
                </p>
              </div>

              {/* Right content - 3D Scene */}
              <div className="flex-1 relative min-h-[300px]">
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-xl text-zinc-300 mb-8">
            Join thousands of families using OASIS to predict crises, discover benefits,
            and build economic stability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-lg font-semibold border border-white/20 transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">OASIS</h3>
              <p className="text-zinc-400 text-sm">
                Empowering families to navigate economic hardship with AI-powered financial guidance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="tel:211" className="hover:text-white transition-colors">211 Social Services</a></li>
                <li><a href="tel:18663114287" className="hover:text-white transition-colors">SNAP Hotline</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Food Resources</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 text-center text-sm text-zinc-400">
            <p>&copy; 2025 OASIS. Built with ❤️ for families facing economic hardship.</p>
            <p className="mt-2">AES-256 encrypted • Bank-grade security • Your data is safe</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'cyan' | 'pink' | 'yellow' | 'red';
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} p-6 hover:scale-105 transition-transform`}>
      <div className={colorClasses[color].split(' ')[3]}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mt-4 mb-2 text-white">{title}</h3>
      <p className="text-sm text-zinc-300">{description}</p>
    </Card>
  );
}
