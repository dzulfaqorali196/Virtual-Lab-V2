import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    index: true
  },
  action: { 
    type: String, 
    required: true,
    index: true
  },
  resourceType: { 
    type: String, 
    enum: ['user', 'module', 'experiment', 'discussion'],
    required: true
  },
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  changes: mongoose.Schema.Types.Mixed,
  metadata: {
    ip: String,
    userAgent: String,
    location: String
  },
  status: { 
    type: String,
    enum: ['success', 'failure'],
    required: true
  },
  errorDetails: String
}, {
  timestamps: true
});

// Indexes
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1, resourceType: 1 });
AuditLogSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);