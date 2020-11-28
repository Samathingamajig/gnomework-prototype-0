export type QuestionTypeType = 'default' | 'free-response' | 'multiple-choice' | 'check-box' | 'true-false' | 'yes-no';

export interface QuestionInterface {
  questionText?: string;
  questionType?: QuestionTypeType;
  answerChoices?: string[];
  correctAnswersIndexes?: number[];
}

export default class Question {
  public questionText: string;
  public questionType: QuestionTypeType;
  public answerChoices: string[];
  public correctAnswersIndexes: number[];

  constructor(params: QuestionInterface = {} as QuestionInterface) {
    this.questionText = params?.questionText || '';
    this.questionType = params?.questionType || 'default';
    this.answerChoices = [];
    this.correctAnswersIndexes = [];
  }

  public modify(params: QuestionInterface = {} as QuestionInterface) {
    for (const key in params) {
      // @ts-ignore
      // See comment [1] below for explanation.
      this[key] = params[key];
    }

    return this;
  }
}

/*
[1]: Why I used @ts-ignore there:
  1) It's the simplest solution
  2) I already know that <params> has to only have key-value pairs that <this> has
  3) There are ways around using @ts-ignore, but every solution that I found lost type safety too, so they are pointless.
     One of them even made it so that QuestionInterface and Question could accept any key-value pairs, and that defeats the purpose of TypeScript.
  4) This could've been solved by modifying `tsconfig.json` to allow all explicit any, but that also defeats the purpose of TypeScript.
*/
