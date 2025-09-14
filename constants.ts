
import type { QuestionType, Difficulty } from './types';
import { QuestionTypeEnum } from './types';

export const QUESTION_TYPES: QuestionType[] = [
  QuestionTypeEnum.MULTIPLE_CHOICE,
  QuestionTypeEnum.SHORT_ANSWER,
  QuestionTypeEnum.PROBLEM_SOLVING,
  QuestionTypeEnum.PROOFS,
  QuestionTypeEnum.ESSAY,
];

export const DIFFICULTY_LEVELS: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Mixed'];
