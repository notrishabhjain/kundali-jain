// Source: Master Engineering Specification §2.2 "Programmatic State Machine Specification"
// Sāmāyika & Pratikramaṇa liturgical state machine interface + Sāmāyika specification.
// Doctrine: Mūlācāra (Vaṭṭakera) ch. 5; Ratnakaranda Śrāvakācāra (Samantabhadra) §9.

export interface LiturgicalStep {
  stepIndex: number;
  sanskritSutra: string;
  ritualPhysicalAction: string;
  focusContemplation: string;
  mentalDisciplineConstraint: string;
}

export interface LiturgicalStateMachine {
  ritualName: 'Sāmāyika' | 'Pratikramaṇa';
  minimumDurationMinutes: number;
  requiredPosture: 'Kāyotsarga' | 'Paryankāsana' | 'Vajrāsana';
  steps: LiturgicalStep[];
  exceptionHandling: {
    onDistractionDetected: string;
    onPostureBreak: string;
  };
}

// Source: Master Engineering Specification §2.2
export const SamayikaSpecification: LiturgicalStateMachine = {
  ritualName: 'Sāmāyika',
  minimumDurationMinutes: 48,
  requiredPosture: 'Kāyotsarga',
  steps: [
    {
      stepIndex: 1,
      sanskritSutra: 'Namo Arihantāṇam... (Namokāra Mahāmantra)',
      ritualPhysicalAction:
        'Stand motionless, arms suspended down, feet parallel at 4-finger distance.',
      focusContemplation: 'Absolute reverence to the five supreme states.',
      mentalDisciplineConstraint: 'Elimination of physical self-consciousness.',
    },
    {
      stepIndex: 2,
      sanskritSutra: 'Karemi Bhante Vow',
      ritualPhysicalAction: 'Fold hands in prayer posture (Añjali Mudrā).',
      focusContemplation:
        'Committing to the vow of equanimity and stopping all sinful actions.',
      mentalDisciplineConstraint:
        'Cessation of all psychological attachment and aversion.',
    },
    {
      stepIndex: 3,
      sanskritSutra: 'Sāmāyiya-vaya-jutto Sutra',
      ritualPhysicalAction: 'Transition to seated meditative posture.',
      focusContemplation:
        'Identifying the soul as distinct from the transient physical body.',
      mentalDisciplineConstraint:
        'Execution of Anyatva and Ekatva Bhavanas.',
    },
    {
      stepIndex: 4,
      sanskritSutra: 'Namokāra Mahāmantra Completion',
      ritualPhysicalAction: 'Gently rise from posture; execute final bow.',
      focusContemplation: 'Re-affirming the state of inner purity.',
      mentalDisciplineConstraint:
        'Gradual transition back to lay activities.',
    },
  ],
  exceptionHandling: {
    onDistractionDetected:
      'Recite one complete silent Namokāra to re-establish focus.',
    onPostureBreak:
      'Restart the 48-minute timer if physical negligence occurs.',
  },
};
