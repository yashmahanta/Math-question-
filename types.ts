// Fix: Added exported enums and types to make this file a module and resolve import errors.
export enum QuestionTypeEnum {
  MULTIPLE_CHOICE = 'Multiple Choice',
  SHORT_ANSWER = 'Short Answer',
  PROBLEM_SOLVING = 'Problem Solving',
  PROOFS = 'Proofs',
  ESSAY = 'Essay',
}

export type QuestionType = QuestionTypeEnum;

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Mixed';
