import { supabase } from '../lib/supabase';

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

export interface Resume {
  id?: string;
  user_id?: string;
  title: string;
  template: string;
  personal_info: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  languages: Language[];
  created_at?: string;
  updated_at?: string;
}

export const resumeService = {
  async getResumes() {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data as Resume[];
  },

  async getResume(id: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Resume;
  },

  async createResume(resume: Omit<Resume, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('resumes')
      .insert([{ ...resume, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data as Resume;
  },

  async updateResume(id: string, resume: Partial<Resume>) {
    const { data, error } = await supabase
      .from('resumes')
      .update(resume)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Resume;
  },

  async deleteResume(id: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async duplicateResume(id: string) {
    const resume = await this.getResume(id);
    const { id: _, user_id: __, created_at: ___, updated_at: ____, ...resumeData } = resume;
    return this.createResume({
      ...resumeData,
      title: `${resume.title} (Copy)`,
    });
  },
};
