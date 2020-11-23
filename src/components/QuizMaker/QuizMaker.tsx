import React, { useState } from 'react';
import QuestionMaker, { QuestionMakerInterface } from './QuestionMaker/QuestionMaker';
import './QuizMaker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function QuizMaker() {
  const [questionMakers, setQuestionMakers] = useState<QuestionMakerInterface[]>([]);

  const addQuestionMaker = () => {
    // Add a blank QuestionMaker to the array of QuestionMakers
    setQuestionMakers((prev) => [...prev, { questionText: '', questionType: 'default' }]);
  };

  const changeQuestionValues = (newValue: QuestionMakerInterface, index: number): void => {
    // This just changes the element at the specified index
    // to the specified new value, but keep others the same.
    //
    // Loop through every element in the array of QuestionMakers.
    // If the index is not the specified index, just return the original value.
    // If the index is the specified index, then return the new value.
    setQuestionMakers((prev) => {
      return prev.map((prevValue, ind) => (ind !== index ? prevValue : newValue));
    });
  };

  const changeQuestionIndex = (newIndex: number, prevIndex: number): void => {
    // This basically pops a QuestionMaker out of the array and inserts it
    // at the new index that is specified.

    setQuestionMakers((prev) => {
      // Get the original QuestionMaker
      const questionMaker = prev[prevIndex];

      // Filter out the original QuestionMaker, so that all
      // that you have left is everything except the given index.
      const newPrev = prev.filter((_, i) => i !== prevIndex);

      // Get everything that would be before the new slot,
      // and everything that would be after the new slot.
      const [before, after] = [newPrev.slice(0, newIndex), newPrev.slice(newIndex)];

      // Return the new combined array, with the QuestionMaker
      // inserted between the before part and the after part.
      return [...before, questionMaker, ...after];
    });
  };

  const deleteQuestion = (index: number) => () => {
    // This removes a question at the specified index,
    // but asks for permission to do so.

    // This function is curried, so the first call of this
    // function sets up so internal state with the index
    // so that we don't have pass in this function a
    // weird way to the children element.

    // First, ask for permission.
    // We have to say "window.confirm" instead of just "confirm"
    // because of an ESLint rule.
    const shouldDelete: boolean = window.confirm('Are you sure you want to delete this question?\nThis cannot be undone!');

    if (shouldDelete) {
      // If we should delete, the filter out everything that's
      // at the specified index.
      // (This just keeps everything EXCEPT the element at the provided index)
      setQuestionMakers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="QuizMaker">
      <h1>QuizMaker</h1>
      <section id="QuestionMakerContainer">
        {questionMakers.map(({ questionText, questionType }, ind) => (
          <QuestionMaker key={ind} index={ind} questionText={questionText} questionType={questionType} changeQuestionValues={changeQuestionValues} quizLength={questionMakers.length} changeQuestionIndex={changeQuestionIndex} deleteQuestion={deleteQuestion} />
        ))}
      </section>
      <button onClick={addQuestionMaker} className="AddQuestionMakerButton">
        <FontAwesomeIcon icon={faPlus} className="AddQuestionMakerIcon" color="white" size="2x"></FontAwesomeIcon>
      </button>
    </div>
  );
}
