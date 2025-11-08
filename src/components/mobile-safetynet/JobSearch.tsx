import { useState, useEffect } from 'react';
import { Briefcase, Clock, DollarSign, MapPin, TrendingUp, Zap, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { supabase } from '../../lib/supabase';
import { useUser } from '../../contexts/UserContext';
import type { Database } from '../../lib/supabase';

type JobListing = Database['public']['Tables']['job_listings']['Row'];
type JobApplication = Database['public']['Tables']['job_applications']['Row'];

interface JobWithApplication extends JobListing {
  hasApplied: boolean;
  applicationStatus?: string;
}

export default function JobSearch() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('quick');
  const [jobs, setJobs] = useState<JobWithApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);

  // Fetch jobs and user applications
  useEffect(() => {
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      // Fetch all active job listings
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_listings')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // If user is logged in, fetch their applications
      let applicationsData: JobApplication[] = [];
      if (user) {
        const { data: appsData, error: appsError } = await supabase
          .from('job_applications')
          .select('*')
          .eq('user_id', user.id);

        if (appsError) throw appsError;
        applicationsData = appsData || [];
      }

      // Combine jobs with application status
      const jobsWithApplications: JobWithApplication[] = (jobsData || []).map(job => {
        const application = applicationsData.find(app => app.job_id === job.id);
        return {
          ...job,
          hasApplied: !!application,
          applicationStatus: application?.status || undefined,
        };
      });

      setJobs(jobsWithApplications);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      alert('Please sign in to apply for jobs');
      return;
    }

    try {
      setApplyingJobId(jobId);

      const { error } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'applied',
        });

      if (error) throw error;

      // Update local state
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId
            ? { ...job, hasApplied: true, applicationStatus: 'applied' }
            : job
        )
      );

      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplyingJobId(null);
    }
  };

  const toggleJobDetails = (jobId: string) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const getFilteredJobs = (type: string) => {
    let filteredJobs = jobs;

    // Filter by type/category
    if (type === 'quick') {
      filteredJobs = jobs.filter(job =>
        job.type === 'gig' || job.type === 'quick-cash'
      );
    } else if (type === 'part-time') {
      filteredJobs = jobs.filter(job => job.type === 'part-time');
    } else if (type === 'remote') {
      filteredJobs = jobs.filter(job => job.type === 'remote');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query)
      );
    }

    return filteredJobs;
  };

  const getFlexibilityBadge = (jobType: string) => {
    if (jobType === 'gig' || jobType === 'remote' || jobType === 'quick-cash') {
      return (
        <div className="flex items-center gap-1 text-green-600 text-sm bg-green-500/10 px-2 py-1 rounded-lg">
          <Zap className="w-3 h-3" />
          <span>Quick Start</span>
        </div>
      );
    }
    return null;
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      applied: { text: 'Applied', color: 'bg-blue-500/10 text-blue-600' },
      reviewing: { text: 'Under Review', color: 'bg-yellow-500/10 text-yellow-600' },
      interview: { text: 'Interview', color: 'bg-purple-500/10 text-purple-600' },
      accepted: { text: 'Accepted', color: 'bg-green-500/10 text-green-600' },
      rejected: { text: 'Not Selected', color: 'bg-gray-500/10 text-gray-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;

    return (
      <div className={`text-sm px-2 py-1 rounded-lg ${config.color}`}>
        {config.text}
      </div>
    );
  };

  const renderJobCard = (job: JobWithApplication) => {
    const isExpanded = expandedJobId === job.id;
    const isApplying = applyingJobId === job.id;

    return (
      <div
        key={job.id}
        className="bg-white/40 backdrop-blur-lg rounded-2xl p-5 border border-white/40 hover:bg-white/60 transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {getFlexibilityBadge(job.type)}
            {job.hasApplied && getStatusBadge(job.applicationStatus)}
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{job.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 text-sm">{job.pay_rate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 text-sm">{job.location}</span>
          </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
          <div className="mb-4 space-y-3 animate-in slide-in-from-top">
            {job.description && (
              <div>
                <p className="text-gray-600 text-xs mb-1">Full Description:</p>
                <p className="text-gray-700 text-sm">{job.description}</p>
              </div>
            )}

            {job.requirements && job.requirements.length > 0 && (
              <div>
                <p className="text-gray-600 text-xs mb-2">Requirements:</p>
                <ul className="space-y-1">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="text-gray-700 text-xs flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.posted_date && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-xs">
                  Posted: {new Date(job.posted_date).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => toggleJobDetails(job.id)}
            variant="outline"
            className="flex-1 bg-white/60 hover:bg-white/80"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Less Details
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                View Details
              </>
            )}
          </Button>

          {job.hasApplied ? (
            <Button
              disabled
              className="flex-1 bg-gray-400 text-white cursor-not-allowed"
            >
              Applied
            </Button>
          ) : (
            <Button
              onClick={() => handleApply(job.id)}
              disabled={isApplying || !user}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white disabled:opacity-50"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderJobList = (type: string) => {
    const filteredJobs = getFilteredJobs(type);

    if (loading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading jobs...</p>
        </div>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {searchQuery ? 'No jobs found matching your search.' : 'No jobs available in this category.'}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredJobs.map(renderJobCard)}
      </div>
    );
  };

  const getCategoryDescription = (type: string) => {
    const descriptions = {
      quick: 'Quick Cash Jobs - Start earning today with flexible gig work',
      'part-time': 'Part-Time Jobs - Steady income with consistent schedules',
      remote: 'Remote Jobs - Work from home with flexible hours',
    };
    return descriptions[type as keyof typeof descriptions];
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 text-2xl">Income Opportunities</h1>
            <p className="text-gray-600">Find flexible work that fits your schedule</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-4 border border-white/60">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/80 border-white/40"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-gray-600 mt-2">
            Showing results for: <strong>{searchQuery}</strong>
          </p>
        )}
      </div>

      {/* Earnings Potential */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Today</span>
            <Zap className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-gray-900 text-2xl">$100</p>
          <p className="text-gray-600 text-xs">Possible</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">This Week</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-gray-900 text-2xl">$400</p>
          <p className="text-gray-600 text-xs">Potential</p>
        </div>

        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg p-5 border border-white/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">Per Month</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-gray-900 text-2xl">$1,600</p>
          <p className="text-gray-600 text-xs">Extra</p>
        </div>
      </div>

      {/* Quick Action for Rent Crisis */}
      <div className="bg-rose-300/30 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 mb-1">Need $94 for Rent by Nov 12?</h3>
            <p className="text-gray-600 text-sm mb-4">
              You need $94 in 4 days. Here's how to get it:
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">• DoorDash (2 dinner shifts)</span>
                <span className="text-green-600">$110</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">• Plasma donation (today)</span>
                <span className="text-green-600">$100</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">• Sell items on OfferUp</span>
                <span className="text-green-600">$50-100</span>
              </div>
            </div>
            <Button
              onClick={() => setActiveTab('quick')}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white"
            >
              Start Earning Now
            </Button>
          </div>
        </div>
      </div>

      {/* Job Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-lg p-1 rounded-2xl border border-white/60">
          <TabsTrigger value="quick" className="rounded-xl">
            Quick Cash
          </TabsTrigger>
          <TabsTrigger value="part-time" className="rounded-xl">
            Part-Time
          </TabsTrigger>
          <TabsTrigger value="remote" className="rounded-xl">
            Remote
          </TabsTrigger>
        </TabsList>

        {/* Quick Cash Tab */}
        <TabsContent value="quick" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{getCategoryDescription('quick')}</strong>
            </p>
          </div>
          {renderJobList('quick')}
        </TabsContent>

        {/* Part-Time Tab */}
        <TabsContent value="part-time" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{getCategoryDescription('part-time')}</strong>
            </p>
          </div>
          {renderJobList('part-time')}
        </TabsContent>

        {/* Remote Tab */}
        <TabsContent value="remote" className="space-y-4 mt-4">
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-4 border border-blue-200/40">
            <p className="text-gray-900">
              <strong>{getCategoryDescription('remote')}</strong>
            </p>
          </div>
          {renderJobList('remote')}
        </TabsContent>
      </Tabs>

      {/* Income Strategy */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h3 className="text-gray-900 mb-4">Recommended Strategy</h3>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5 text-white">
            <p className="text-white/80 mb-2">Short-term (Next 4 days)</p>
            <p className="text-2xl mb-2">Gig Work + Quick Cash</p>
            <p className="text-white/90 text-sm">
              Combine DoorDash shifts with plasma donation to earn $94+ for rent
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-5 border border-white/40">
            <p className="text-gray-600 mb-2">Medium-term (This month)</p>
            <p className="text-gray-900 text-xl mb-2">Part-Time Position</p>
            <p className="text-gray-700 text-sm">
              Add 15-20 hours/week at Target or Amazon for steady extra $240-370/week
            </p>
          </div>

          <div className="bg-white/40 backdrop-blur-lg rounded-2xl p-5 border border-white/40">
            <p className="text-gray-600 mb-2">Long-term (3+ months)</p>
            <p className="text-gray-900 text-xl mb-2">Skills Development</p>
            <p className="text-gray-700 text-sm">
              Free training programs available for higher-paying careers
            </p>
          </div>
        </div>
      </div>

      {/* Time vs Money Calculator */}
      <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/60">
        <h3 className="text-gray-900 mb-4">Time vs Money Calculator</h3>
        <p className="text-gray-600 text-sm mb-4">How many hours to earn different amounts?</p>

        <div className="space-y-3">
          {[
            { amount: 94, hours: { doordash: 4.7, instacart: 5.2, target: 5.9 } },
            { amount: 200, hours: { doordash: 10, instacart: 11.1, target: 12.5 } },
            { amount: 500, hours: { doordash: 25, instacart: 27.8, target: 31.3 } },
          ].map((calc) => (
            <div
              key={calc.amount}
              className="bg-white/40 backdrop-blur-lg rounded-2xl p-4 border border-white/40"
            >
              <p className="text-gray-900 mb-2">To earn ${calc.amount}:</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-gray-600">DoorDash</p>
                  <p className="text-blue-600">{calc.hours.doordash} hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Instacart</p>
                  <p className="text-blue-600">{calc.hours.instacart} hours</p>
                </div>
                <div>
                  <p className="text-gray-600">Target</p>
                  <p className="text-blue-600">{calc.hours.target} hours</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
