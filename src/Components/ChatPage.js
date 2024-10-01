import React, { useState, useEffect } from 'react';
import ConversationsPage from "./ConversationsPage";
import InputCom from "./InputCom";
import Navbar from "./NavBar";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { questions } from '../Constants/questions';

const openAiApiKey = process.env.REACT_APP_OPENAI_API; // Store your OpenAI API key here

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
      const responses = {};
      for (const questionId of sentQuestionIds) {
        const question = questionsToSend[questionId];
        const candidateAnswer = candidateAnswers[questionId];

        if (question && candidateAnswer) {
          const result = await evaluateAnswer(question, candidateAnswer);
          responses[questionId] = result;
        } else {
          responses[questionId] = { feedback: "Question or answer missing.", score: null };
        }
      }

      console.log("API Response:", responses);
      navigate('/feedback', { state: { data: responses, questions: categoryQuestions } });
    } catch (error) {
      console.error('Error sending request:', error);
    } finally {
      setLoading(false);
    }
  };

  
  const evaluateAnswer = async (question, candidateAnswer) => {
    const messages = [
      { role: "system", content: "You are an interview evaluator." },
      { role: "user", content: `Please evaluate the following answer to the question '${question}'. Analyze the depth of understanding and accuracy demonstrated by the candidate's response. Provide a detailed summary and confidence score. Answer: ${candidateAnswer}` }
    ];
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions', 
        {
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      const completionText = response.data.choices[0].message.content;
      console.log("Completion Text:", completionText);
  
      // Extract score using a regex pattern
      const scoreMatch = completionText.match(/Score:\s*(\d\.\d+)/i);
      const score = scoreMatch ? parseFloat(scoreMatch[1]) : "Score not found";
  
      return {
        feedback: completionText.trim(),
        score: score
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      return { feedback: "Error evaluating the answer", score: null };
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
