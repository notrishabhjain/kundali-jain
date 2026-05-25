/**
 * Engine Facade (Phase 1 Contract Freeze)
 *
 * This module is a stable integration boundary for all UI consumers.
 * It re-exports the existing prediction and calculation engine without
 * changing computation behavior.
 */
export {
  AnalysisSynthesizer,
  generateUserProfile,
  getTodayContext,
  getUpcomingVratDates,
} from './analysisSynthesizer';

export type {
  BirthFormData,
  DayContext,
  UserProfile,
  UpcomingVrat,
  VratType,
  DashaInfo,
  AntardashaInfo,
  PratyantardashInfo,
} from './analysisSynthesizer';
