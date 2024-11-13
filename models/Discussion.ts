import mongoose from 'mongoose';

const DiscussionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module' 
  },
  experimentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Experiment' 
  },
  type: { 
    type: String, 
    enum: ['question', 'discussion', 'experiment_share'], 
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  status: { 
    type: String, 
    enum: ['active', 'closed', 'flagged', 'deleted'], 
    default: 'active' 
  },
  metrics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 }
  },
  replies: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: String,
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['active', 'flagged', 'deleted'], 
      default: 'active' 
    }
  }]
}, {
  timestamps: true
});

// Indexes
DiscussionSchema.index({ userId: 1 });
DiscussionSchema.index({ moduleId: 1 });
DiscussionSchema.index({ experimentId: 1 });
DiscussionSchema.index({ tags: 1 });
DiscussionSchema.index({ status: 1 });
DiscussionSchema.index({ createdAt: -1 });
DiscussionSchema.index({ 'metrics.views': -1 });
DiscussionSchema.index({ 'metrics.likes': -1 });

export default mongoose.models.Discussion || mongoose.model('Discussion', DiscussionSchema);