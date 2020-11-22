import React, { ChangeEvent } from 'react';
import ToolTip from '../../ToolTip/ToolTip';
import './QuestionMaker.scss';

export interface QuestionMakerInterface {
  questionText: string;
  questionType: string;
}

export interface QuestionMakerProps {
  index: number;
  changeQuestionValues: (newValue: QuestionMakerInterface, index: number) => void;
  quizLength: number;
  changeQuestionIndex: (newIndex: number, prevIndex: number) => void;
}

export default function QuestionMaker({ index, questionText, questionType, changeQuestionValues, quizLength, changeQuestionIndex }: QuestionMakerProps & QuestionMakerInterface) {
  const setQuestionText = (newTextEvent: ChangeEvent<HTMLInputElement>) => {
    changeQuestionValues({ questionText: newTextEvent.target.value, questionType }, index);
  };

  const setQuestionType = (newSelectionEvent: ChangeEvent<HTMLSelectElement>) => {
    console.log(newSelectionEvent);
    console.log(newSelectionEvent.target);
    console.log(newSelectionEvent.target.value);
    changeQuestionValues({ questionText, questionType: newSelectionEvent.target.value }, index);
  };

  const setQuestionIndex = () => {
    let newIndex: string | null = prompt('What number should this question change to?');
    while (true) {
      if (newIndex === null) return;
      if (!/^-?\d+$/.test(newIndex + '')) newIndex = prompt(`Your input of "${newIndex || '<empty>'}" is invalid. Enter a new value, or select cancel.`);
      else if (+newIndex <= 0 || +newIndex > quizLength) newIndex = prompt(`Your input of "${newIndex}" is outside of the range 1-${quizLength}. Enter a new value, or select cancel.`);
      else break;
    }
    console.log(newIndex);

    changeQuestionIndex(+newIndex - 1, index);
  };

  return (
    <div className="QuestionMaker">
      <div className="QuestionNameSection">
        <ToolTip onClick={setQuestionIndex} className="ChangeIndex" hoverText="Click to change the question number">{`${index + 1}. `}</ToolTip>
        <input type="text" value={questionText} onChange={setQuestionText} placeholder="Question goes here..."></input>
        <select required value={questionType} title="Select what kind of question this is..." onChange={setQuestionType}>
          <option value="default" disabled>
            Type of question
          </option>
          <option value="free-response">Free Response</option>
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True or False</option>
          <option value="check-box">Check Box</option>
        </select>
      </div>
    </div>
  );
}
