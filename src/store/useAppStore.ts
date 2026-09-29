import { create } from 'zustand';

interface AppState {
  questionCountSession: number;
  incrementQuestionCount: () => void;
  resetQuestionCount: () => void;
  
  // Focus Mode State
  isFocusModeActive: boolean;
  setFocusMode: (active: boolean) => void;
  questionsAnsweredInFocus: number;
  incrementFocusAnswers: () => void;
  resetFocusAnswers: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  questionCountSession: 0,
  incrementQuestionCount: () => set((state) => ({ questionCountSession: state.questionCountSession + 1 })),
  resetQuestionCount: () => set({ questionCountSession: 0 }),
  
  isFocusModeActive: false,
  setFocusMode: (active) => set({ isFocusModeActive: active }),
  questionsAnsweredInFocus: 0,
  incrementFocusAnswers: () => set((state) => ({ questionsAnsweredInFocus: state.questionsAnsweredInFocus + 1 })),
  resetFocusAnswers: () => set({ questionsAnsweredInFocus: 0 }),
}));
