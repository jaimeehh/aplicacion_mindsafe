import { create } from 'zustand';

interface SurveyState {
  answers: number[];
  selectedAnswer: number | null;
  isCompleted: boolean;
  totalScore: number;
  submitAnswer: (questionIndex: number, answer: number) => void;
  resetSurvey: () => void;
  setSelectedAnswer: (answer: number | null) => void;
}

export const useSurvey = create<SurveyState>((set) => ({
  answers: [],
  selectedAnswer: null,
  isCompleted: false,
  totalScore: 0,
  submitAnswer: (questionIndex: number, answer: number) => {
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[questionIndex] = answer;
      const isCompleted =
        newAnswers.filter((a) => a !== undefined).length === 6;
      const totalScore = newAnswers.reduce((sum, val) => sum + (5 - val), 0);
      return {
        answers: newAnswers,
        isCompleted,
        totalScore,
        selectedAnswer: null,
      };
    });
  },
  resetSurvey: () => {
    set({
      answers: [],
      isCompleted: false,
      totalScore: 0,
      selectedAnswer: null,
    });
  },
  setSelectedAnswer: (answer: number | null) => {
    set({ selectedAnswer: answer });
  },
}));
