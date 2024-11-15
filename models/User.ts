import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  provider: { 
    type: String, 
    required: true,
    trim: true 
  },
  providerAccountId: { 
    type: String, 
    required: true,
    trim: true 
  },
  type: String,
  access_token: String,
  token_type: String,
  expires_at: Number,
  refresh_token: String,
  scope: String,
  id_token: String
}, { 
  _id: false 
});

const UserSchema = new mongoose.Schema({
  name: { 
    type: String,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  emailVerified: Date,
  image: String,
  
  // OAuth specific fields
  accounts: [AccountSchema],

  // User profile data
  profile: {
    bio: { 
      type: String,
      maxlength: [500, 'Bio tidak boleh lebih dari 500 karakter'],
      trim: true
    },
    institution: { 
      type: String,
      maxlength: [100, 'Nama institusi tidak boleh lebih dari 100 karakter'],
      trim: true
    },
    role: { 
      type: String,
      maxlength: [50, 'Role tidak boleh lebih dari 50 karakter'],
      trim: true
    },
    expertise: [{
      type: String,
      maxlength: [30, 'Expertise tidak boleh lebih dari 30 karakter'],
      trim: true
    }],
    social: {
      twitter: { 
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || v === '' || v.startsWith('https://');
          },
          message: 'URL Twitter harus diawali dengan https://'
        }
      },
      linkedin: { 
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || v === '' || v.startsWith('https://');
          },
          message: 'URL LinkedIn harus diawali dengan https://'
        }
      },
      github: { 
        type: String,
        trim: true,
        validate: {
          validator: function(v: string) {
            return !v || v === '' || v.startsWith('https://');
          },
          message: 'URL GitHub harus diawali dengan https://'
        }
      }
    },
    achievements: [{
      id: { 
        type: String,
        required: true,
        unique: true
      },
      name: { 
        type: String,
        required: true,
        trim: true
      },
      description: { 
        type: String,
        required: true,
        trim: true
      },
      earnedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    stats: {
      experimentsCompleted: { 
        type: Number, 
        default: 0,
        min: 0
      },
      totalExperimentTime: { 
        type: Number, 
        default: 0,
        min: 0
      },
      avgDuration: {
        type: Number,
        default: 0
      },
      avgAngle: {
        type: Number,
        default: 0
      },
      lastActive: { 
        type: Date, 
        default: Date.now 
      }
    }
  },

  // System fields
  userRole: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user',
    required: true
  },
  status: { 
    type: String, 
    enum: ['active', 'suspended'], 
    default: 'active',
    required: true 
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    experimentSettings: {
      type: Object,
      default: {
        notifications: true
      }
    }
  },
  stats: {
    experimentsCompleted: {
      type: Number,
      default: 0
    },
    totalExperimentTime: {
      type: Number,
      default: 0
    },
    avgDuration: {
      type: Number,
      default: 0
    },
    avgAngle: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  strict: true
});

// Indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ 'accounts.provider': 1, 'accounts.providerAccountId': 1 });
UserSchema.index({ userRole: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ updatedAt: 1 });

// Ensure model isn't recreated
export default mongoose.models.User || mongoose.model('User', UserSchema);