import React, { useState, useEffect } from 'react';
import ConversationsPage from "./ConversationsPage";
import InputCom from "./InputCom";
import Navbar from "./NavBar";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { questions } from '../Constants/questions';

const apiUrl = process.env.REACT_APP_API_URL;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sentQuestionIds, setSentQuestionIds] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState({});
  const [questionCounter, setQuestionCounter] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const location = useLocation();
  const { category } = location.state || {};
  const categoryQuestions = questions[category] || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCompleted) {
        askQuestion();
    }
}, [isCompleted]); 

  const askQuestion = () => {
    if (questionCounter >= 4) {
      console.log("All questions asked, waiting for user submission...");
      setIsCompleted(true); // Enable the submit button
      return;
    }

    const questionIds = Object.keys(categoryQuestions);
    const filteredQuestionIds = questionIds.filter(id => !sentQuestionIds.includes(id));
    if (filteredQuestionIds.length === 0) return;

    const randomIndex = Math.floor(Math.random() * filteredQuestionIds.length);
    const randomQuestionId = filteredQuestionIds[randomIndex];
    const question = categoryQuestions[randomQuestionId];

    setSentQuestionIds(prev => [...prev, randomQuestionId]);
    setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
    setQuestionCounter(prevCount => prevCount + 1);
  };

  const handleAPICall = async () => {
    setLoading(true); // Set loading state to true
    const questionsToSend = {};
    sentQuestionIds.forEach(id => {
      questionsToSend[id] = categoryQuestions[id];
    });

    try {
      const response = await axios.post(`${apiUrl}/evaluate`, {
        sent_question_ids: sentQuestionIds,
        candidate_answers: candidateAnswers,
        questions: questionsToSend
      });
      console.log("API Response:", response.data);
      navigate('/feedback', { state: { data: response.data, questions: categoryQuestions } });
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  const updateCandidateAnswer = (questionId, answer) => {
    setCandidateAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  const handleSendMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
    updateCandidateAnswer(sentQuestionIds[sentQuestionIds.length - 1], message);
    if (!isCompleted) { // Only ask next question if not completed
      askQuestion();
    }
  };

  return (
    <div className="fade-in height px-8 flex flex-col justify-between">
      <Navbar />
      <ConversationsPage messages={messages} />
      <InputCom
        questionId={sentQuestionIds[sentQuestionIds.length - 1]}
        onSendMessage={handleSendMessage}
        onUpdateCandidateAnswer={updateCandidateAnswer}
        isCompleted={isCompleted}
      />
      {isCompleted && (
        <button
          className="bg-blue-500 text-white text-lg font-bold py-3 px-6 flex justify-center items-center w-full max-w-[600px] rounded-full self-center sticky bottom-10 transition duration-300 ease-in-out hover:bg-blue-600"
          onClick={handleAPICall}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Submit Interview"
          )}
        </button>
      )}
    </div>
  );
}
