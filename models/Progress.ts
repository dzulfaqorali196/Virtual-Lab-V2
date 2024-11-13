import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true
  },
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['not_started', 'in_progress', 'completed'], 
    default: 'not_started' 
  },
  completedSections: [String],
  quizScores: Map,
  lastAccessed: { type: Date, default: Date.now },
  timeSpent: { type: Number, default: 0 }, // in seconds
  achievements: [{
    id: String,
    name: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
ProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });
ProgressSchema.index({ status: 1 });
ProgressSchema.index({ lastAccessed: -1 });

export default mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);