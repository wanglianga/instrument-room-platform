export enum BulkBorrowingStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PARTIALLY_APPROVED = 'partially_approved',
  REJECTED = 'rejected',
  LOCKED = 'locked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ConflictType {
  INSTRUMENT_UNAVAILABLE = 'instrument_unavailable',
  INSTRUMENT_IN_REPAIR = 'instrument_in_repair',
  INSTRUMENT_SEALED = 'instrument_sealed',
  RESERVATION_CONFLICT = 'reservation_conflict',
  ROOM_CONFLICT = 'room_conflict',
  TEACHER_APPROVAL_REQUIRED = 'teacher_approval_required',
}

export enum ConflictSeverity {
  WARNING = 'warning',
  ERROR = 'error',
  INFO = 'info',
}
