import React, { useEffect, useState } from 'react';
import ConversationsPage from "./ConversationsPage";
import InputCom from "./InputCom";
import Navbar from "./NavBar";
import axios from 'axios';

// Dictionary of interview questions
const interviewQuestions = {
  1: "What is OOP",
  2: "What is polymorphism",
  3: "what is inheritance",
  4: "what is data abstraction",
  5: "what is data encapsulation",
  // Add more questions as needed
};

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [sentQuestionIds, setSentQuestionIds] = useState([]);
    const [questionCounter, setQuestionCounter] = useState(0);
    const [candidateAnswers, setCandidateAnswers] = useState({}); // State to store candidate answers
    const [currentQuestion,setCurrentQuestion] = useState(); // State to store the current question ID [1,2,3,4,5,...
useEffect(() => {
    const questionIds = Object.keys(interviewQuestions);
        const filteredQuestionIds = questionIds.filter(id => !sentQuestionIds.includes(id));
    const randomIndex = Math.floor(Math.random() * filteredQuestionIds.length);
    const randomQuestionId = filteredQuestionIds[randomIndex];
    // Get the corresponding question and send it as the bot's response
    const botResponse = interviewQuestions[randomQuestionId];
    setCurrentQuestion(randomQuestionId);
    setSentQuestionIds([...sentQuestionIds, randomQuestionId]); // Update the list of sent question IDs
    setQuestionCounter(questionCounter + 1); // Increment the question counter
    setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
}, []);
    // Function to handle sending messages
    const handleSendMessage = async (message) => {
        setMessages(prevMessages => [...prevMessages, { text: message, sender: 'user' }]);
        // Randomly select an interview question ID
        const questionIds = Object.keys(interviewQuestions);
        const filteredQuestionIds = questionIds.filter(id => !sentQuestionIds.includes(id));
        if (filteredQuestionIds.length === 0) {
            // If all questions have been sent, reset the sentQuestionIds list and question counter
            setSentQuestionIds([]);
            setQuestionCounter(0);
        } else {
            const randomIndex = Math.floor(Math.random() * filteredQuestionIds.length);
            const randomQuestionId = filteredQuestionIds[randomIndex];
            // Get the corresponding question and send it as the bot's response
            const botResponse = interviewQuestions[randomQuestionId];
            setCurrentQuestion(randomQuestionId);
            setSentQuestionIds([...sentQuestionIds, randomQuestionId]); // Update the list of sent question IDs
            setQuestionCounter(questionCounter + 1); // Increment the question counter
            
            // If 3 questions have been asked, make the API call
            if (questionCounter > 3) {
                await handleAPICall(sentQuestionIds, candidateAnswers);
                setQuestionCounter(0); // Reset the question counter after making the API call
            }
            
            setTimeout(() => {
                setMessages(prevMessages => [...prevMessages, { text: botResponse, sender: 'bot' }]);
            }, 200);
        }
    };

    // Function to handle the API call
    const handleAPICall = async (sentQuestionIds, candidateAnswers) => {
        try {
            const response = await axios.post('http://localhost:5000/evaluate', {
                sent_question_ids: sentQuestionIds, // Send the sent question IDs data to the API
                candidate_answers: candidateAnswers // Send the candidate answers data to the API
            });
            console.log(response.data); // Log the response from the API
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

    return (
        <div className="fade-in height px-8 flex flex-col justify-between">
            <Navbar />
            <ConversationsPage messages={messages} />
            <InputCom questionId={currentQuestion} onSendMessage={handleSendMessage} onUpdateCandidateAnswer={updateCandidateAnswer} />
        </div>
    )
}
