import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Save, Eye, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { resumeService, Resume, Experience, Education, Skill, Certification, Project, Language } from '../services/resumeService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [resume, setResume] = useState<Resume>({
    title: 'My Resume',
    template: 'modern',
    personal_info: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
  });

  useEffect(() => {
    if (id && id !== 'new') {
      loadResume();
    }
  }, [id]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getResume(id!);
      setResume(data);
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (id && id !== 'new') {
        await resumeService.updateResume(id, resume);
        toast.success('Resume saved successfully');
      } else {
        const newResume = await resumeService.createResume(resume);
        toast.success('Resume created successfully');
        navigate(`/resume/builder/${newResume.id}`);
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('resume-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${resume.title}.pdf`);
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          id: crypto.randomUUID(),
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        {
          id: crypto.randomUUID(),
          school: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
        },
      ],
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = () => {
    setResume({
      ...resume,
      skills: [
        ...resume.skills,
        {
          id: crypto.randomUUID(),
          name: '',
          level: 'intermediate',
        },
      ],
    });
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    });
  };

  const removeSkill = (id: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-gray-50 to-cyan-50/30 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl border border-white/60 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/resume')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <Input
                  value={resume.title}
                  onChange={(e) => setResume({ ...resume, title: e.target.value })}
                  className="text-2xl font-bold border-none bg-transparent focus:ring-0 p-0"
                  placeholder="Resume Title"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="backdrop-blur-xl bg-white/40 rounded-2xl border border-white/60 p-6 shadow-lg">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={resume.personal_info.fullName}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal_info: { ...resume.personal_info, fullName: e.target.value },
                      })
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resume.personal_info.email}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal_info: { ...resume.personal_info, email: e.target.value },
                        })
                      }
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={resume.personal_info.phone}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal_info: { ...resume.personal_info, phone: e.target.value },
                        })
                      }
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={resume.personal_info.location}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        personal_info: { ...resume.personal_info, location: e.target.value },
                      })
                    }
                    placeholder="City, State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>LinkedIn (optional)</Label>
                    <Input
                      value={resume.personal_info.linkedin}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal_info: { ...resume.personal_info, linkedin: e.target.value },
                        })
                      }
                      placeholder="linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label>Website (optional)</Label>
                    <Input
                      value={resume.personal_info.website}
                      onChange={(e) =>
                        setResume({
                          ...resume,
                          personal_info: { ...resume.personal_info, website: e.target.value },
                        })
                      }
                      placeholder="johndoe.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Professional Summary</Label>
                  <Textarea
                    value={resume.summary}
                    onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                    placeholder="Brief summary of your professional background..."
                    rows={5}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Work Experience</h3>
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </div>

              {resume.experience.map((exp) => (
                <Card key={exp.id} className="p-4 space-y-4 bg-white/60">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Experience</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Company</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="rounded"
                      />
                      <Label>Current Position</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                      rows={4}
                    />
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="education" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Education</h3>
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </div>

              {resume.education.map((edu) => (
                <Card key={edu.id} className="p-4 space-y-4 bg-white/60">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Education</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(edu.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>School</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder="University Name"
                      />
                    </div>
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Bachelor's, Master's, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Field of Study</Label>
                      <Input
                        value={edu.field}
                        onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>GPA (optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Skills</h3>
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill
                </Button>
              </div>

              <div className="space-y-3">
                {resume.skills.map((skill) => (
                  <Card key={skill.id} className="p-4 bg-white/60">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          placeholder="Skill name"
                        />
                      </div>
                      <div className="w-40">
                        <Select
                          value={skill.level}
                          onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="backdrop-blur-xl bg-white/40 rounded-2xl border border-white/60 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div id="resume-preview" className="bg-white p-8 rounded-lg shadow-sm">
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center border-b-2 border-gray-800 pb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {resume.personal_info.fullName || 'Your Name'}
                  </h1>
                  <div className="text-sm text-gray-600 mt-2 space-x-3">
                    {resume.personal_info.email && <span>{resume.personal_info.email}</span>}
                    {resume.personal_info.phone && <span>• {resume.personal_info.phone}</span>}
                    {resume.personal_info.location && <span>• {resume.personal_info.location}</span>}
                  </div>
                </div>

                {/* Summary */}
                {resume.summary && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Summary</h2>
                    <p className="text-gray-700 text-sm">{resume.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {resume.experience.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Experience</h2>
                    <div className="space-y-4">
                      {resume.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                              <p className="text-gray-700">{exp.company}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                            </div>
                          </div>
                          {exp.description && (
                            <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {resume.education.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3">Education</h2>
                    <div className="space-y-3">
                      {resume.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                              <p className="text-gray-700">{edu.school}</p>
                            </div>
                            <div className="text-sm text-gray-600">
                              {edu.startDate} - {edu.endDate}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {resume.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
