import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2, Copy, Edit, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { resumeService, Resume } from '../services/resumeService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

export default function ResumePage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getResumes();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/resume/builder/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/resume/builder/${id}`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      await resumeService.duplicateResume(id);
      toast.success('Resume duplicated successfully');
      loadResumes();
    } catch (error) {
      toast.error('Failed to duplicate resume');
    }
  };

  const handleDelete = async () => {
    if (!selectedResume) return;

    try {
      await resumeService.deleteResume(selectedResume);
      toast.success('Resume deleted successfully');
      loadResumes();
    } catch (error) {
      toast.error('Failed to delete resume');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedResume(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resumes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">Create and manage your professional resumes</p>
        </div>
        <Button onClick={handleCreateNew} size="lg">
          <Plus className="w-5 h-5 mr-2" />
          Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="p-12 text-center backdrop-blur-xl bg-white/60 border-white/60">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first professional resume</p>
          <Button onClick={handleCreateNew}>
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Resume
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card
              key={resume.id}
              className="backdrop-blur-xl bg-white/60 border-white/60 hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleEdit(resume.id!)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Updated {resume.updated_at ? formatDate(resume.updated_at) : 'recently'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {resume.personal_info.fullName && (
                    <p className="text-sm text-gray-700 font-medium">{resume.personal_info.fullName}</p>
                  )}
                  {resume.experience.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {resume.experience.length} experience{resume.experience.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {resume.education.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {resume.education.length} education{resume.education.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {resume.skills.length > 0 && (
                    <p className="text-sm text-gray-600">
                      {resume.skills.length} skill{resume.skills.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(resume.id!);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(resume.id!);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResume(resume.id!);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
