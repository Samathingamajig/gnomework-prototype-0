import React, { ChangeEvent } from 'react';
import ToolTip from '../../ToolTip/ToolTip';
import './QuestionMaker.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Question, { QuestionInterface, QuestionTypeType } from '../../../classes/Question';

export interface QuestionMakerProps {
  question: Question;
  index: number;
  changeQuestionValues: (newValue: QuestionInterface, index: number) => void;
  quizLength: number;
  changeQuestionIndex: (newIndex: number, prevIndex: number) => void;
  deleteQuestion: (index: number) => () => void;
}

export default function QuestionMaker({ question, index, changeQuestionValues, quizLength, changeQuestionIndex, deleteQuestion }: QuestionMakerProps) {
  const setQuestionText = (newTextEvent: ChangeEvent<HTMLInputElement>) => {
    // This function changes the text of the input element,
    // and pushes it up to the parent's state changer function.
    changeQuestionValues({ questionText: newTextEvent.target.value }, index);
  };

  const setQuestionType = (newSelectionEvent: ChangeEvent<HTMLSelectElement>) => {
    // This function changes the question type of the select element,
    // and pushes it up to the parent's state changer function.
    let { questionType: oldQuestionType, answerChoices, correctAnswersIndexes } = question;
    let questionType = newSelectionEvent.target.value as QuestionTypeType;
    if (questionType === oldQuestionType) return;

    switch (questionType) {
      case 'default':
      case 'free-response':
        answerChoices = [];
        correctAnswersIndexes = [];
        break;
      case 'multiple-choice':
        correctAnswersIndexes = [correctAnswersIndexes[0]].filter((val) => val !== undefined);
        break;
      case 'true-false':
        answerChoices = ['True', 'False'];
        correctAnswersIndexes = [];
        break;
      case 'yes-no':
        answerChoices = ['Yes', 'No'];
        correctAnswersIndexes = [];
        break;
    }

    changeQuestionValues({ questionType, answerChoices, correctAnswersIndexes }, index);
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

  const addAnswerChoice = () => {
    changeQuestionValues({ answerChoices: [...question.answerChoices, ''] }, index);
  };

  const changeAnswerChoiceText = (newTextEvent: ChangeEvent<HTMLInputElement>, answerChoiceIndex: number) => {
    let { answerChoices } = question;

    // Change the text at the given index to the new value
    answerChoices = answerChoices.map((val, ind) => (ind !== answerChoiceIndex ? val : (newTextEvent.target.value as QuestionTypeType)));

    changeQuestionValues({ answerChoices }, index);
  };

  const deleteAnswerChoice = (answerChoiceIndex: number) => {
    let { answerChoices, correctAnswersIndexes } = question;

    // Filter out the answer at the given index
    answerChoices = answerChoices.filter((_, ind) => ind !== answerChoiceIndex);

    correctAnswersIndexes = correctAnswersIndexes
      .filter((aCorrectIndex) => aCorrectIndex !== answerChoiceIndex) // Remove this question from the correct answers, if it's in there
      .map((aCorrectIndex) => (aCorrectIndex > answerChoiceIndex ? aCorrectIndex - 1 : aCorrectIndex)); // Shift the indexes down if they're after the current question index

    changeQuestionValues({ answerChoices, correctAnswersIndexes }, index);
  };

  const toggleCheckbox = (checkboxIndex: number) => {
    let { correctAnswersIndexes } = question;
    // If it is already selected, remove it from the selection list, otherwise add it
    if (correctAnswersIndexes.includes(checkboxIndex)) {
      correctAnswersIndexes = correctAnswersIndexes.filter((aCorrectIndex) => aCorrectIndex !== checkboxIndex);
    } else {
      correctAnswersIndexes = [...correctAnswersIndexes, checkboxIndex];
    }

    if (question.questionType !== 'check-box') {
      // Filter out everything that isn't the given index
      correctAnswersIndexes = correctAnswersIndexes.filter((aCorrectIndex) => aCorrectIndex === checkboxIndex);
    } else {
      // Sort so that the data is organized
      correctAnswersIndexes = correctAnswersIndexes.sort((a, b) => a - b);
    }

    changeQuestionValues({ correctAnswersIndexes }, index);
  };

  return (
    <div className="QuestionMaker">
      <div className="QuestionNameSection">
        <ToolTip onClick={setQuestionIndex} className="ChangeIndex" hoverText="Click to change the question number">{`${index + 1}. `}</ToolTip>
        <input type="text" value={question.questionText} onChange={setQuestionText} placeholder="Question goes here..." required spellCheck={true}></input>
        <select value={question.questionType} title="Select what kind of question this is..." onChange={setQuestionType} required>
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

      {question.questionType !== 'default' && question.questionType !== 'free-response' && (
        <div className="QuestionAnswersSection">
          <ol type="A">
            {question.answerChoices?.map((val, ind) => {
              return (
                <span key={ind}>
                  <input type={question.questionType === 'check-box' ? 'checkbox' : 'radio'} name={`correct-answer-${index}`} value={val} checked={question.correctAnswersIndexes.includes(ind)} onChange={() => toggleCheckbox(ind)} />
                  <label htmlFor={val}>
                    <li key={ind}>
                      {question.questionType === 'multiple-choice' || question.questionType === 'check-box' ? (
                        <>
                          <input type="text" value={val} onChange={(e) => changeAnswerChoiceText(e, ind)} placeholder="Answer choice goes here..." spellCheck={true} />
                        </>
                      ) : (
                        <>
                          <span>{val}</span>
                        </>
                      )}
                    </li>
                  </label>
                  {(question.questionType === 'multiple-choice' || question.questionType === 'check-box') && (
                    <button onClick={() => deleteAnswerChoice(ind)}>
                      <FontAwesomeIcon icon={faTrashAlt} size="lg" color="white"></FontAwesomeIcon>
                    </button>
                  )}
                </span>
              );
            })}
          </ol>
        </div>
      )}

      {question.questionType === 'multiple-choice' || question.questionType === 'check-box' ? (
        <button onClick={addAnswerChoice} className="AddAnswerChoiceButton">
          <FontAwesomeIcon icon={faPlus} color="white" size="lg" className="AddAnswerChoiceIcon"></FontAwesomeIcon>
        </button>
      ) : (
        <br />
      )}
      <hr />
      <button onClick={deleteQuestion(index)} className="RemoveQuestionMakerButton">
        <FontAwesomeIcon icon={faTrashAlt} color="white" size="lg" className="RemoveQuestionMakerIcon"></FontAwesomeIcon>
      </button>
    </div>
  );
}
