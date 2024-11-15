import { Types } from 'mongoose';

export interface ExperimentParameters {
  length: number;
  mass: number;
  angle: number;
}

export interface ExperimentMeasurement {
  time: number;
  angle: number;
  energy: number;
}

export interface Experiment {
  _id: any;
  id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExperimentStats {
  totalExperiments: number;
  avgDuration: number;
  avgAngle: number;
  totalTime: number;
}

