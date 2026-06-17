export enum DisputeType {
  SCRATCH = 'scratch',
  MISSING_PARTS = 'missing_parts',
  MOISTURE = 'moisture',
  PITCH_ABNORMAL = 'pitch_abnormal',
  OTHER = 'other',
}

export enum DisputeStatus {
  PENDING = 'pending',
  TEACHER_REVIEWING = 'teacher_reviewing',
  TECHNICIAN_QUOTING = 'technician_quoting',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum PerformanceImpact {
  AFFECTED = 'affected',
  NOT_AFFECTED = 'not_affected',
  NEEDS_ASSESSMENT = 'needs_assessment',
}
