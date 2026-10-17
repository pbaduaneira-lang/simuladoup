export interface PublicQuestion {
  id: string;
  version: string;
  materia: string;
  enunciado: string;
  alternativas: string[];
  source: {
    year: number;
    number: number;
    language: string | null;
    url: string;
    answerKeyUrl: string;
  };
}
export interface AnswerResult {
  acertou: boolean;
  correta: number;
  explicacaoIA: string;
  xpGained: number;
  persisted: boolean;
  replayed: boolean;
}
export interface StudyRecord {
  key: string;
  questionId: string;
  materia: string;
  acertou: boolean;
  createdAt: string;
}
