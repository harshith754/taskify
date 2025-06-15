
export type UserRole = 'developer' | 'manager';
export type EntityStatus = 'open' | 'in_progress' | 'closed' | 'pending_approval';
export type Priority = 'low' | 'medium' | 'high';
export type Impact = 'low' | 'medium' | 'high' | 'critical';

export interface AuthState {
  userId: string | null;
  name: string;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isCurrentUser: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: EntityStatus;
  assigneeId: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  updates: string[];
  timeSpent: number;
  isTracking?: boolean;
  trackingStartedAt?: number;
}


// Bug
export interface Bug {
  id: string;
  title: string;
  description: string;
  impact: Impact;
  priority: Priority;
  status: EntityStatus;
  severity: 'low' | 'medium' | 'high' | 'critical';
  stepsToReproduce: string;
  environment: string;
  assigneeId: string;
  createdAt: string;
  startDate?: string;
  endDate?: string;
  updates: string[];
  timeSpent: number;
}

export interface Update {
  id: string;
  parentId: string;
  type: 'task' | 'bug';
  message: string;
  createdBy: string;
  createdAt: string;
}


export type ItemType = "task" | "bug";

export type UnifiedItem = {
  id: string;
  status: EntityStatus;
  priority: Priority;
  assigneeId: string;
  endDate?: string;
  itemType: ItemType;
};
