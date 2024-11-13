import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  order: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['theory', 'simulation', 'quiz'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  },
  content: {
    sections: [{
      id: String,
      title: String,
      content: String,
      order: Number,
      type: {
        type: String,
        enum: ['text', 'video', 'interactive', 'quiz']
      },
      quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
      }]
    }],
    resources: [{
      title: String,
      type: String,
      url: String
    }]
  },
  metadata: {
    duration: Number, // in minutes
    difficulty: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'advanced'] 
    },
    prerequisites: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Module' 
    }],
    tags: [String]
  }
}, {
  timestamps: true
});

// Indexes
ModuleSchema.index({ slug: 1 }, { unique: true });
ModuleSchema.index({ status: 1 });
ModuleSchema.index({ 'metadata.tags': 1 });
ModuleSchema.index({ order: 1 });

export default mongoose.models.Module || mongoose.model('Module', ModuleSchema);