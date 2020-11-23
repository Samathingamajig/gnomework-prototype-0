import React, { ChangeEvent } from 'react';
import ToolTip from '../../ToolTip/ToolTip';
import './QuestionMaker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

export interface QuestionMakerInterface {
  questionText: string;
  questionType: string;
}

export interface QuestionMakerProps {
  index: number;
  changeQuestionValues: (newValue: QuestionMakerInterface, index: number) => void;
  quizLength: number;
  changeQuestionIndex: (newIndex: number, prevIndex: number) => void;
  deleteQuestion: (index: number) => () => void;
}

export default function QuestionMaker({ index, questionText, questionType, changeQuestionValues, quizLength, changeQuestionIndex, deleteQuestion }: QuestionMakerProps & QuestionMakerInterface) {
  const setQuestionText = (newTextEvent: ChangeEvent<HTMLInputElement>) => {
    // This function changes the text of the input element,
    // and pushes it up to the parent's state changer function.
    changeQuestionValues({ questionText: newTextEvent.target.value, questionType }, index);
  };

  const setQuestionType = (newSelectionEvent: ChangeEvent<HTMLSelectElement>) => {
    // This function changes the question type of the select element,
    // and pushes it up to the parent's state changer function.
    changeQuestionValues({ questionText, questionType: newSelectionEvent.target.value }, index);
  };

  const setQuestionIndex = () => {
    // This function changes the index of the question in the parent's array.
    // (This just changes the question number and ordering)

    // Ask for what number this question should change to
    let newIndex: string | null = window.prompt('What number should this question change to?');

    // Validate the response...
    while (true) {
      // If they press cancel, null is given, so we want to
      // completely break out of this function.
      if (newIndex === null) return;

      // Use a regex to test if it's not a number
      /*
       * !/^-?\d+$/
       * !            Invert the output
       *  /           Start the regex
       *   ^          Pattern matches from the very beginning
       *    -?        Optional negative sign, so 0 or 1 negative signs
       *      \d+     \d means any digit 0-9, and the + means 1 or more, so 1 or more than 1 digits
       *         $    Pattern matches to the very end
       *          /   End the regex
       */
      if (!/^-?\d+$/.test(newIndex + '')) newIndex = window.prompt(`Your input of "${newIndex || '<empty>'}" is invalid. Enter a new value, or select cancel.`);
      // So if it is a number, we need to make sure it's in the range.
      // If it isn't, give an error and reprompt.
      else if (+newIndex <= 0 || +newIndex > quizLength) newIndex = window.prompt(`Your input of "${newIndex}" is outside of the range 1-${quizLength}. Enter a new value, or select cancel.`);
      // So if it is a number, and it's in range,
      // then break out of the verification loop.
      else break;
    }

    // Pass this info to the parent's changeQuestionIndex function.
    // We need to convert the number from a string into a number,
    // add subtract 1 to make it 0-indexed.
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
          <option value="check-box">Check Box</option>
          <option value="true-false">True or False</option>
          <option value="yes-no">Yes or No</option>
        </select>
      </div>

      <br />
      <hr />
      <button onClick={deleteQuestion(index)} className="RemoveQuestionMakerButton">
        <FontAwesomeIcon icon={faTrashAlt} color="white" size="lg" className="RemoveQuestionMakerIcon"></FontAwesomeIcon>
      </button>
    </div>
  );
}
