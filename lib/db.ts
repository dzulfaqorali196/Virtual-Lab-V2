import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Progress from '@/models/Progress';
import Experiment from '@/models/Experiment';
import Discussion from '@/models/Discussion';
import AuditLog from '@/models/AuditLog';
import type { 
  User as UserType, 
  Progress as ProgressType, 
  Experiment as ExperimentType,
  Discussion as DiscussionType,
  AuditLog as AuditLogType
} from '@/types/db';

export async function findUserById(id: string) {
  await connectDB();
  const user = await User.findById(id).lean() as UserType | null;
  if (!user) return null;
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    preferences: user.preferences,
    profile: user.profile
  };
}

export async function addUser(userData: { name: string; email: string; password: string }) {
  await connectDB();
  const newUser = new User({
    ...userData,
    preferences: {
      theme: 'system',
      defaultLength: 1.0,
      defaultMass: 0.5,
      defaultAngle: 45,
      view3D: false,
      notifications: {
        email: true,
        push: true
      }
    },
    profile: {
      bio: '',
      institution: '',
      role: '',
      expertise: [],
      social: {}
    },
    role: 'user',
    status: 'active',
    loginAttempts: 0
  });
  
  const savedUser = await newUser.save();
  return {
    id: savedUser._id.toString(),
    name: savedUser.name,
    email: savedUser.email
  };
}

export async function updateUserProfile(userId: string, profileData: Partial<UserType['profile']>) {
  await connectDB();
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { profile: profileData } },
    { new: true, runValidators: true }
  ).lean() as UserType | null;

  if (!updatedUser) return null;

  await AuditLog.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: 'UPDATE_PROFILE',
    resourceType: 'user',
    resourceId: new mongoose.Types.ObjectId(userId),
    changes: profileData,
    status: 'success'
  });

  return updatedUser.profile;
}

export async function updateUserPreferences(userId: string, preferences: Partial<UserType['preferences']>) {
  await connectDB();
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { preferences } },
    { new: true, runValidators: true }
  ).lean() as UserType | null;

  if (!updatedUser) return null;

  await AuditLog.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: 'UPDATE_PREFERENCES',
    resourceType: 'user',
    resourceId: new mongoose.Types.ObjectId(userId),
    changes: preferences,
    status: 'success'
  });

  return updatedUser.preferences;
}

export async function saveExperiment(userId: string, experimentData: Omit<ExperimentType, '_id' | 'userId' | 'createdAt' | 'updatedAt'>) {
  await connectDB();
  
  const experiment = new Experiment({
    userId: new mongoose.Types.ObjectId(userId),
    ...experimentData,
    status: 'completed'
  });
  
  const savedExperiment = await experiment.save();

  // Update user stats
  await User.findByIdAndUpdate(userId, {
    $inc: { 
      'profile.stats.experimentsCompleted': 1,
      'profile.stats.totalExperimentTime': experimentData.duration
    },
    $set: { 'profile.stats.lastActive': new Date() }
  });

  await AuditLog.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: 'SAVE_EXPERIMENT',
    resourceType: 'experiment',
    resourceId: savedExperiment._id,
    status: 'success'
  });

  return savedExperiment.toObject();
}

export async function getUserExperiments(userId: string) {
  await connectDB();
  const experiments = await Experiment.find({ 
    userId: new mongoose.Types.ObjectId(userId) 
  })
    .sort({ createdAt: -1 })
    .lean() as unknown as ExperimentType[];
  
  return experiments.map(exp => ({
    ...exp,
    id: exp._id.toString()
  }));
}

export async function updateLearningProgress(userId: string, progressData: Partial<ProgressType>) {
  await connectDB();
  const progress = await Progress.findOneAndUpdate(
    { userId: new mongoose.Types.ObjectId(userId) },
    {
      $set: progressData,
      $currentDate: { lastAccessed: true }
    },
    { new: true, upsert: true, runValidators: true }
  ).lean() as ProgressType | null;

  if (!progress) return null;

  // Update user's last active timestamp
  await User.findByIdAndUpdate(userId, {
    $currentDate: { 'profile.stats.lastActive': true }
  });

  await AuditLog.create({
    userId: new mongoose.Types.ObjectId(userId),
    action: 'UPDATE_PROGRESS',
    resourceType: 'progress',
    resourceId: progress._id,
    status: 'success'
  });

  return {
    ...progress,
    id: progress._id.toString()
  };
}

export async function getLearningProgress(userId: string) {
  await connectDB();
  const progress = await Progress.findOne({ 
    userId: new mongoose.Types.ObjectId(userId) 
  }).lean() as ProgressType | null;
  
  if (!progress) return null;
  
  return {
    ...progress,
    id: progress._id.toString()
  };
}

// ... kode lainnya tetap sama ...

export async function getUserProfile(userId: string) {
  await connectDB();
  try {
    // Coba cari user dengan berbagai kemungkinan identifier
    const user = await User.findOne({ 
      $or: [
        // Coba konversi ke ObjectId jika valid
        ...(mongoose.Types.ObjectId.isValid(userId) ? [{ _id: new mongoose.Types.ObjectId(userId) }] : []),
        // Cek juga provider account id dan email
        { 'accounts.providerAccountId': userId },
        { email: userId }
      ]
    })
    .select('profile preferences')
    .lean() as UserType | null;
    
    if (!user) return null;

    // Pastikan profile memiliki struktur yang benar
    const profile = {
      bio: user.profile?.bio || '',
      institution: user.profile?.institution || '',
      role: user.profile?.role || '',
      expertise: user.profile?.expertise || [],
      social: user.profile?.social || {},
      stats: {
        experimentsCompleted: user.profile?.stats?.experimentsCompleted || 0,
        totalExperimentTime: user.profile?.stats?.totalExperimentTime || 0,
        lastActive: user.profile?.stats?.lastActive || new Date()
      }
    };

    // Pastikan preferences memiliki nilai default
    const preferences = {
      theme: user.preferences?.theme || 'system',
      defaultLength: user.preferences?.defaultLength || 1.0,
      defaultMass: user.preferences?.defaultMass || 0.5,
      defaultAngle: user.preferences?.defaultAngle || 45,
      view3D: user.preferences?.view3D || false
    };

    return {
      profile,
      preferences
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return null;
  }
}

export async function getDiscussions(query: Partial<DiscussionType> = {}) {
  await connectDB();
  const discussions = await Discussion.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'name image')
    .lean() as unknown as DiscussionType[];

  return discussions.map(disc => ({
    ...disc,
    id: disc._id.toString()
  }));
}

export async function createAuditLog(logData: Partial<AuditLogType>) {
  await connectDB();
  const log = await AuditLog.create({
    ...logData,
    userId: new mongoose.Types.ObjectId(logData.userId as unknown as string),
    resourceId: new mongoose.Types.ObjectId(logData.resourceId as unknown as string)
  });
  return log.toObject();
}