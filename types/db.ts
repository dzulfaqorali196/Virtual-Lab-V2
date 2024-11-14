import { ObjectId } from 'mongoose';

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  image?: string;
  accounts: Array<{
    provider: string;
    providerAccountId: string;
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    scope?: string;
  }>;
  profile: {
    bio?: string;
    institution?: string;
    role?: string;
    expertise?: string[];
    social?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
    stats: {
      experimentsCompleted: number;
      totalExperimentTime: number;
      lastActive: Date;
    };
  };
  preferences?: {
    theme?: string;
    defaultLength?: number;
    defaultMass?: number;
    defaultAngle?: number;
    view3D?: boolean;
  };
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Progress {
  _id: ObjectId;
  userId: ObjectId;
  moduleId: ObjectId;
  status: 'not_started' | 'in_progress' | 'completed';
  completedSections: string[];
  quizScores: Map<string, number>;
  lastAccessed: Date;
  timeSpent: number;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  _id: ObjectId;
  title: string;
  slug: string;
  description?: string;
  order: number;
  type: 'theory' | 'simulation' | 'quiz';
  status: 'draft' | 'published' | 'archived';
  content: {
    sections: Array<{
      id: string;
      title: string;
      content: string;
      order: number;
      type: 'text' | 'video' | 'interactive' | 'quiz';
      quiz?: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
      }>;
    }>;
    resources: Array<{
      title: string;
      type: string;
      url: string;
    }>;
  };
  metadata: {
    duration: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    prerequisites: ObjectId[];
    tags: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Experiment {
    _id: ObjectId;
    userId: ObjectId;
    timestamp: number;
    length: number;
    mass: number;
    angle: number;
    duration: number;
    measurements: Array<{
      time: number;
      angle: number;
      energy: number;
    }>;
    status: 'running' | 'completed' | 'error';
    createdAt: Date;
    updatedAt: Date;
  }

export interface Discussion {
  _id: ObjectId;
  userId: ObjectId;
  moduleId?: ObjectId;
  experimentId?: ObjectId;
  type: 'question' | 'discussion' | 'experiment_share';
  title: string;
  content: string;
  tags: string[];
  status: 'active' | 'closed' | 'flagged' | 'deleted';
  metrics: {
    views: number;
    likes: number;
    replies: number;
  };
  replies: Array<{
    userId: ObjectId;
    content: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    status: 'active' | 'flagged' | 'deleted';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  _id: ObjectId;
  userId: ObjectId;
  action: string;
  resourceType: 'user' | 'module' | 'experiment' | 'discussion';
  resourceId: ObjectId;
  changes?: any;
  metadata: {
    ip?: string;
    userAgent?: string;
    location?: string;
  };
  status: 'success' | 'failure';
  errorDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}