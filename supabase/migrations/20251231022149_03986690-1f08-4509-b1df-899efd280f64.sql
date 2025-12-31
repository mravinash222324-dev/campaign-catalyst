-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'dm_manager',
  'copywriter',
  'copy_qc',
  'designer',
  'design_qc',
  'client_coordinator',
  'dm_team_lead'
);

-- Create enum for task status
CREATE TYPE public.task_status AS ENUM (
  'draft',
  'pending',
  'in_progress',
  'review',
  'approved',
  'rejected',
  'client_review',
  'published'
);

-- Create enum for priority
CREATE TYPE public.priority_level AS ENUM (
  'low',
  'normal',
  'high',
  'critical'
);

-- Create enum for platform
CREATE TYPE public.platform_type AS ENUM (
  'facebook',
  'instagram',
  'linkedin',
  'twitter',
  'google_ads',
  'youtube'
);

-- Create enum for ad type
CREATE TYPE public.ad_type AS ENUM (
  'awareness',
  'lead_generation'
);

-- Create enum for task type
CREATE TYPE public.task_type AS ENUM (
  'copy',
  'design',
  'copy_qc',
  'design_qc',
  'client_review',
  'publishing'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'copywriter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  industry TEXT NOT NULL,
  monthly_budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create briefs table
CREATE TABLE public.briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  objective TEXT NOT NULL,
  target_audience TEXT,
  platforms platform_type[] NOT NULL DEFAULT '{}',
  budget DECIMAL(12,2),
  priority priority_level NOT NULL DEFAULT 'normal',
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status task_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE NOT NULL,
  assignee_id UUID REFERENCES auth.users(id),
  type task_type NOT NULL,
  status task_status NOT NULL DEFAULT 'pending',
  priority priority_level NOT NULL DEFAULT 'normal',
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_comments table
CREATE TABLE public.task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create ads table
CREATE TABLE public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID REFERENCES public.briefs(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  type ad_type NOT NULL,
  platform platform_type NOT NULL,
  budget DECIMAL(12,2) NOT NULL DEFAULT 0,
  spent DECIMAL(12,2) NOT NULL DEFAULT 0,
  leads INTEGER NOT NULL DEFAULT 0,
  reach INTEGER NOT NULL DEFAULT 0,
  ctr DECIMAL(5,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings table
CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meeting_decisions table
CREATE TABLE public.meeting_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES public.meetings(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'implemented')),
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create QC checklists table
CREATE TABLE public.qc_checklists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL UNIQUE,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  client_priority_met BOOLEAN NOT NULL DEFAULT false,
  brand_tone BOOLEAN NOT NULL DEFAULT false,
  platform_guidelines BOOLEAN NOT NULL DEFAULT false,
  grammar_clarity BOOLEAN NOT NULL DEFAULT false,
  cta_alignment BOOLEAN NOT NULL DEFAULT false,
  comments TEXT,
  is_approved BOOLEAN,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_briefs_updated_at BEFORE UPDATE ON public.briefs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meeting_decisions_updated_at BEFORE UPDATE ON public.meeting_decisions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), NEW.email);
  
  -- Default role is copywriter
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'copywriter');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qc_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- USER_ROLES POLICIES (only admins can modify, all can read own)
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CLIENTS POLICIES (all authenticated can view, admin/dm_manager can modify)
CREATE POLICY "Authenticated users can view clients" ON public.clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and DM Managers can insert clients" ON public.clients FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins and DM Managers can update clients" ON public.clients FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins can delete clients" ON public.clients FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- BRIEFS POLICIES
CREATE POLICY "Authenticated users can view briefs" ON public.briefs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and DM Managers can insert briefs" ON public.briefs FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins and DM Managers can update briefs" ON public.briefs FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins can delete briefs" ON public.briefs FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- TASKS POLICIES
CREATE POLICY "Authenticated users can view tasks" ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view assigned tasks" ON public.tasks FOR SELECT TO authenticated USING (assignee_id = auth.uid());
CREATE POLICY "Admins and DM Managers can insert tasks" ON public.tasks FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Assignees can update their tasks" ON public.tasks FOR UPDATE TO authenticated 
  USING (assignee_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins can delete tasks" ON public.tasks FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- TASK_COMMENTS POLICIES
CREATE POLICY "Authenticated users can view comments" ON public.task_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert comments" ON public.task_comments FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.task_comments FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.task_comments FOR DELETE TO authenticated 
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ADS POLICIES
CREATE POLICY "Authenticated users can view ads" ON public.ads FOR SELECT TO authenticated USING (true);
CREATE POLICY "DM Team Lead and above can insert ads" ON public.ads FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager') OR public.has_role(auth.uid(), 'dm_team_lead'));
CREATE POLICY "DM Team Lead and above can update ads" ON public.ads FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager') OR public.has_role(auth.uid(), 'dm_team_lead'));
CREATE POLICY "Admins can delete ads" ON public.ads FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- MEETINGS POLICIES
CREATE POLICY "Authenticated users can view meetings" ON public.meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and DM Managers can insert meetings" ON public.meetings FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins and DM Managers can update meetings" ON public.meetings FOR UPDATE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins can delete meetings" ON public.meetings FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- MEETING_DECISIONS POLICIES
CREATE POLICY "Authenticated users can view decisions" ON public.meeting_decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins and DM Managers can insert decisions" ON public.meeting_decisions FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Owners can update their decisions" ON public.meeting_decisions FOR UPDATE TO authenticated 
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'dm_manager'));
CREATE POLICY "Admins can delete decisions" ON public.meeting_decisions FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- QC_CHECKLISTS POLICIES
CREATE POLICY "Authenticated users can view checklists" ON public.qc_checklists FOR SELECT TO authenticated USING (true);
CREATE POLICY "QC roles can insert checklists" ON public.qc_checklists FOR INSERT TO authenticated 
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'copy_qc') OR public.has_role(auth.uid(), 'design_qc'));
CREATE POLICY "QC roles can update checklists" ON public.qc_checklists FOR UPDATE TO authenticated 
  USING (reviewer_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete checklists" ON public.qc_checklists FOR DELETE TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));

-- AUDIT_LOGS POLICIES (only admins can view)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT TO authenticated 
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.briefs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_comments;