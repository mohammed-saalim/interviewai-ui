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
  const location = useLocation();
  const { category } = location.state || {}; // Ensure that category is defined
  const categoryQuestions = questions[category] || {}; // Ensure that categoryQuestions is defined
  const navigate = useNavigate();

  useEffect(() => {
    askQuestion();
  }, []); // This will only run once when the component mounts

  const askQuestion = () => {
    console.log("Asking question from category:", category); // Debug log
    if (questionCounter >= 3) {
      console.log("All questions asked, wrapping up...");
      sendThankYouMessage();
      handleAPICall();
      return;
    }

    const questionIds = Object.keys(categoryQuestions);
    const filteredQuestionIds = questionIds.filter(id => !sentQuestionIds.includes(id));
    if (filteredQuestionIds.length === 0) return; // No more questions to ask

    const randomIndex = Math.floor(Math.random() * filteredQuestionIds.length);
    const randomQuestionId = filteredQuestionIds[randomIndex];
    const question = categoryQuestions[randomQuestionId]; // Fetch question from categoryQuestions, not questions

    console.log("Selected question:", question); // Debug log

    setSentQuestionIds(prev => [...prev, randomQuestionId]);
    setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
    setQuestionCounter(prevCount => prevCount + 1);
  };

  const sendThankYouMessage = () => {
    setMessages(prevMessages => [...prevMessages, { text: "Thank you for attending the interview!", sender: 'bot' }]);
  };

  const handleAPICall = async () => {
    try {
      // Prepare the questions to send
      const questionsToSend = {};
      sentQuestionIds.forEach(id => {
        questionsToSend[id] = categoryQuestions[id];
      });
  
      const response = await axios.post(`${apiUrl}/evaluate`, {
        sent_question_ids: sentQuestionIds,
        candidate_answers: candidateAnswers,
        questions: questionsToSend // Include the actual questions in the request
      });
      console.log("API Response:", response.data); // Log the response from the API
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
    askQuestion();
  };

  return (
    <div className="fade-in height px-8 flex flex-col justify-between">
      <Navbar />
      <ConversationsPage messages={messages} />
      <InputCom
        questionId={sentQuestionIds[sentQuestionIds.length - 1]} // Ensure the current question ID is correctly defined
        onSendMessage={handleSendMessage}
        onUpdateCandidateAnswer={() => {}} // Placeholder function
      />
    </div>
  );
}
