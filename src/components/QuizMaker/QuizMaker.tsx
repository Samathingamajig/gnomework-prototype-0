import React, { useState } from 'react';
import QuestionMaker, { QuestionMakerInterface } from './QuestionMaker/QuestionMaker';
import './QuizMaker.scss';

export default function QuizMaker() {
  const [questionMakers, setQuestionMakers] = useState<QuestionMakerInterface[]>([]);

  const addQuestionMaker = () => {
    setQuestionMakers((prev) => [...prev, { questionText: '', questionType: 'default' }]);
  };

  const changeQuestionValues = (newValue: QuestionMakerInterface, index: number): void => {
    setQuestionMakers((prev) => {
      return prev.map((prevValue, ind) => (ind !== index ? prevValue : newValue));
    });
  };

  const changeQuestionIndex = (newIndex: number, prevIndex: number): void => {
    setQuestionMakers((prev) => {
      const questionMaker = prev[prevIndex];
      // console.log({ questionMaker, prev });
      const newPrev = prev.filter((_, i) => i !== prevIndex);
      // console.log({ newPrev });
      const [start, end] = [newPrev.slice(0, newIndex), newPrev.slice(newIndex)];
      // console.log({ start, questionMaker, end });
      // console.log([...start, questionMaker, ...end]);
      return [...start, questionMaker, ...end];
    });
  };

  return (
    <div className="QuizMaker">
      <h1>QuizMaker</h1>
      <section id="QuestionMakerContainer">
        {questionMakers.map(({ questionText, questionType }, ind) => (
          <QuestionMaker key={ind} index={ind} questionText={questionText} questionType={questionType} changeQuestionValues={changeQuestionValues} quizLength={questionMakers.length} changeQuestionIndex={changeQuestionIndex} />
        ))}
      </section>
      <button onClick={addQuestionMaker}>Add Question</button>
    </div>
  );
}
