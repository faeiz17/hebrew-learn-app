export interface Option {
  _id: string;
  hebrew: string;
  english: string;
  isCorrect: boolean;
}

export interface Exercise {
  _id: string;
  question: string;
  options: Option[];
  storyId: string;
}
