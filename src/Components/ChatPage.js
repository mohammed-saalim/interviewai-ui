import React, { useState, useEffect } from 'react';
import ConversationsPage from "./ConversationsPage";
import InputCom from "./InputCom";
import Navbar from "./NavBar";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { questions } from '../Constants/questions';

const apiUrl = process.env.REACT_APP_API_URL;

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [sentQuestionIds, setSentQuestionIds] = useState([]);
  const [candidateAnswers, setCandidateAnswers] = useState({});
  const [questionCounter, setQuestionCounter] = useState(0);
  const navigate = useNavigate();

  // Function to start asking questions
  useEffect(() => {
    askQuestion();
  }, []);

  // Function to ask a question
  const askQuestion = () => {
    if (questionCounter >= 3) {
      // If the question limit is reached, submit responses
      console.log(sentQuestionIds, candidateAnswers); // Log the sent question IDs and candidate answers (for testing purposes)
      sendThankYouMessage();
      handleAPICall();
      return;
    }
    const questionIds = Object.keys(questions);
    const filteredQuestionIds = questionIds.filter(id => !sentQuestionIds.includes(id));
    if (filteredQuestionIds.length === 0) return; // No more questions to ask
    const randomIndex = Math.floor(Math.random() * filteredQuestionIds.length);
    const randomQuestionId = filteredQuestionIds[randomIndex];
    const question = questions[randomQuestionId];
    setSentQuestionIds([...sentQuestionIds, randomQuestionId]);
    setMessages(prevMessages => [...prevMessages, { text: question, sender: 'bot' }]);
    setQuestionCounter(questionCounter + 1);
  };

  // Function to send a "thank you" message
  const sendThankYouMessage = () => {
    setMessages(prevMessages => [...prevMessages, { text: "Thank you for attending the interview!", sender: 'bot' }]);
  };

  // Function to handle the API call


const handleAPICall = async () => {
  try {
    const response = await axios.post(`${apiUrl}/evaluate`, {
      sent_question_ids: sentQuestionIds,
      candidate_answers: candidateAnswers
    });
    console.log(response.data); // Log the response from the API
    navigate('/feedback', { state: { data: response.data, questions: questions } });
  } catch (error) {
    console.error('Error sending request:', error);
  }
};


  // Function to update candidate answers
  const updateCandidateAnswer = (questionId, answer) => {
    setCandidateAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: answer
    }));
  };

  // Function to handle the input component sending a message
  const handleSendMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
    updateCandidateAnswer(sentQuestionIds[sentQuestionIds.length - 1], message);
    askQuestion(); // Ask the next question after receiving the answer
  };

  return (
    <div className="fade-in height px-8 flex flex-col justify-between">
      <Navbar />
      <ConversationsPage messages={messages} />
      <InputCom
        questionId={sentQuestionIds[sentQuestionIds.length - 1]} // Pass the current question ID
        onSendMessage={handleSendMessage}
        onUpdateCandidateAnswer={() => {}} // Empty function because we're not updating answers here
      />
    </div>
  );
}
