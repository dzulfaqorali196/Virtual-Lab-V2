import mongoose, { Schema, model, Document } from 'mongoose';

export interface ExperimentDocument extends Document {
  userId: string;
  title: string;
  description?: string;
  timestamp: Date;
  parameters: {
    length: number;
    mass: number;
    angle: number;
  };
  duration: number;
  measurements: Array<{
    time: number;
    angle: number;
    energy: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ExperimentSchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  parameters: {
    length: { type: Number, required: true },
    mass: { type: Number, required: true },
    angle: { type: Number, required: true }
  },
  duration: {
    type: Number,
    default: 0
  },
  measurements: [{
    time: Number,
    angle: Number,
    energy: Number
  }]
}, {
  timestamps: true
});

const Experiment = mongoose.models.Experiment || model<ExperimentDocument>('Experiment', ExperimentSchema);

export default Experiment; 