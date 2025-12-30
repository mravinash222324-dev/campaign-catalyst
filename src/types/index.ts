export type UserRole = 
  | 'admin'
  | 'dm_manager'
  | 'copywriter'
  | 'copy_qc'
  | 'designer'
  | 'design_qc'
  | 'client_coordinator'
  | 'dm_team_lead';

export type TaskStatus = 
  | 'draft'
  | 'pending'
  | 'in_progress'
  | 'review'
  | 'approved'
  | 'rejected'
  | 'client_review'
  | 'published';

export type Priority = 'low' | 'normal' | 'high' | 'critical';

export type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'google_ads' | 'youtube';

export type AdType = 'awareness' | 'lead_generation';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  monthlyBudget: number;
  createdAt: Date;
}

export interface Brief {
  id: string;
  clientId: string;
  title: string;
  objective: string;
  targetAudience: string;
  platform: Platform[];
  budget?: number;
  priority: Priority;
  deadline: Date;
  createdAt: Date;
  createdBy: string;
  status: TaskStatus;
}

export interface Task {
  id: string;
  briefId: string;
  assigneeId: string;
  type: 'copy' | 'design' | 'copy_qc' | 'design_qc' | 'client_review' | 'publishing';
  status: TaskStatus;
  priority: Priority;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
  comments?: Comment[];
  attachments?: Attachment[];
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  createdAt: Date;
}

export interface QCChecklist {
  clientPriorityMet: boolean;
  brandTone: boolean;
  platformGuidelines: boolean;
  grammarClarity: boolean;
  ctaAlignment: boolean;
  comments?: string;
}

export interface Ad {
  id: string;
  briefId: string;
  clientId: string;
  type: AdType;
  platform: Platform;
  budget: number;
  spent: number;
  leads: number;
  reach: number;
  ctr: number;
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  endDate?: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  attendees: string[];
  decisions: MeetingDecision[];
}

export interface MeetingDecision {
  id: string;
  description: string;
  ownerId: string;
  status: 'not_started' | 'in_progress' | 'implemented';
  dueDate?: Date;
}

export interface KPICard {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}
