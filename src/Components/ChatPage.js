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
        <button className="bg-blue-500 text-white text-lg font-bold py-3 px-6 flex justify-center items-center w-full max-w-[600px] rounded-full self-center sticky bottom-10 transition duration-300 ease-in-out hover:bg-blue-600" onClick={handleAPICall}>
          Submit Interview
        </button>
      )}
    </div>
  );
}
