import React, { useState } from 'react';
import { BiSend } from 'react-icons/bi';

export default function InputCom({ onSendMessage, onUpdateCandidateAnswer, questionId, isCompleted }) {
    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;
        onSendMessage(inputText);
        onUpdateCandidateAnswer(questionId, inputText);
        setInputText(''); // Clear input field
    };

    if (isCompleted) {
        return null; // Return nothing if the interview is completed
    }

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
            }}
            className="bg-white box-shadow p-3 flex items-center w-full max-w-[600px] rounded-full self-center sticky bottom-10"
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
