import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  accounts: [{
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    access_token: String,
    expires_at: Number,
    refresh_token: String,
    scope: String
  }],
  preferences: {
    theme: { type: String, default: 'system' },
    defaultLength: { type: Number, default: 1.0 },
    defaultMass: { type: Number, default: 0.5 },
    defaultAngle: { type: Number, default: 45 },
    view3D: { type: Boolean, default: false },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  profile: {
    bio: String,
    institution: String,
    role: String,
    expertise: [String],
    social: {
      twitter: String,
      linkedin: String,
      github: String
    },
    stats: {
      experimentsCompleted: { type: Number, default: 0 },
      totalExperimentTime: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now }
    }
  },
  role: { 
    type: String, 
    enum: ['user', 'moderator', 'admin'], 
    default: 'user' 
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended', 'banned'], 
    default: 'active' 
  },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date
}, {
  timestamps: true
});

// Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);