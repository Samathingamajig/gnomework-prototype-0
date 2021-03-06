import React, { useEffect, useState } from 'react';
import QuestionMaker from './QuestionMaker/QuestionMaker';
import './QuizMaker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Question, { QuestionInterface } from '../../classes/Question';

export default function QuizMaker() {
  const [questionMakers, setQuestionMakers] = useState<Question[]>([]);
  const [data, setData] = useState<string>('');
  const [shouldLiveUpdate, setShouldLiveUpdate] = useState<boolean>(() => false);

  useEffect(() => {
    if (shouldLiveUpdate) setData(JSON.stringify(questionMakers, null, 2));
  }, [questionMakers, setData, shouldLiveUpdate]);

  const addQuestionMaker = () => {
    // Add a blank Question to the array of QuestionMakers
    setQuestionMakers((prev) => [...prev, new Question()]);
  };

  const changeQuestionValues = (newValue: QuestionInterface, index: number): void => {
    // This just changes the element at the specified index
    // to the specified new value, but keep others the same.
    //
    // Loop through every element in the array of QuestionMakers.
    // If the index is not the specified index, just return the original value.
    // If the index is the specified index, then return the new value.
    setQuestionMakers((prev) => {
      return prev.map((prevValue, ind) => (ind !== index ? prevValue : prevValue.modify(newValue)));
    });
  };

  const changeQuestionIndex = (newIndex: number, prevIndex: number): void => {
    // This basically pops a QuestionMaker out of the array and inserts it
    // at the new index that is specified.

    setQuestionMakers((prev) => {
      // Get the original question
      const question = prev[prevIndex];

      // Filter out the original question, so that all
      // that you have left is everything except the given index.
      const newPrev = prev.filter((_, i) => i !== prevIndex);

      // Get everything that would be before the new slot,
      // and everything that would be after the new slot.
      const [before, after] = [newPrev.slice(0, newIndex), newPrev.slice(newIndex)];

      // Return the new combined array, with the question
      // inserted between the before part and the after part.
      return [...before, question, ...after];
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

  const saveToJSONFile = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${filename}.json`;
    document.querySelector('#root')?.appendChild(link);
    link.click();
    document.querySelector('#root')?.removeChild(link);
  };

  return (
    <>
      <div className="QuizMaker">
        <h1>QuizMaker</h1>
        <div id="QuestionMakerContainer">
          {questionMakers.map((question, ind) => (
            <QuestionMaker key={ind} index={ind} question={question} changeQuestionValues={changeQuestionValues} quizLength={questionMakers.length} changeQuestionIndex={changeQuestionIndex} deleteQuestion={deleteQuestion} />
          ))}
        </div>
        <button onClick={addQuestionMaker} className="AddQuestionMakerButton">
          <FontAwesomeIcon icon={faPlus} className="AddQuestionMakerIcon" color="white" size="2x"></FontAwesomeIcon>
        </button>
      </div>
      <br />
      <button onClick={() => setData(JSON.stringify(questionMakers, null, 2))}>render</button>
      <button onClick={() => setShouldLiveUpdate((prev) => !prev)}>live updating: {`${shouldLiveUpdate}`}</button>
      {data && (
        <>
          <br />
          <button onClick={() => navigator.clipboard.writeText(data)}>copy</button>
          <button onClick={() => saveToJSONFile(data, 'data')}>save to JSON file</button>
          <pre>{data}</pre>
        </>
      )}
    </>
  );
}
