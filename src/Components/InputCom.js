import React, { useState } from 'react';
import { BiSend } from 'react-icons/bi';

export default function InputCom({ onSendMessage, onUpdateCandidateAnswer, questionId }) {
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    onSendMessage(inputText); // Send message to parent component
    if (inputText.trim().toLowerCase() !== 'hi'){
    onUpdateCandidateAnswer(questionId, inputText); // Update candidate answer
  }
    setInputText(''); // Clear input field
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
      className="bg-white box-shadow p-3 flex items-center w-full max-w-[600px] rounded-full self-center sticky bottom-2"
    >
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-[90%] outline-none text-[1rem] text-blue"
        placeholder="Type your answer..."
      />
      <button type="submit" className="text-3xl text-blue">
        <BiSend />
      </button>
    </form>
  );
}
