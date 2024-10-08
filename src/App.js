import React, { useState } from 'react';
import FirstLoadPage from './Components/FirstLoadPage';
import OnboardPage from './Components/OnBoardPage';
import ChatPage from './Components/ChatPage';
import Feedback from './Components/Feedback';
import {Routes, Route} from 'react-router-dom'
import Category from './Components/Category';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return; // Ignore empty messages
    const newMessage = { text: inputText, sender: 'user' };
    setMessages([...messages, newMessage]); // Add the user's message to the messages array
    setInputText(''); // Clear the input field after sending the message
    // Call your API to get chatbot response here
    // For demonstration, let's just add a sample response after a delay
    setTimeout(() => {
      const botMessage = { text: 'This is a sample response from the chatbot.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]); // Add the bot's response to the messages array
    }, 500);
  };


  return (
    <div className="font-nunito">
      <Routes>
       <Route path="/" element={<FirstLoadPage />} />
       <Route path="/onboard" element={<OnboardPage />} />
       <Route path="/chat" element={<ChatPage />} />
       <Route path="/feedback" element={<Feedback />} />
       <Route path="/category" element={<Category />} />
      </Routes>
    </div>
   )
  
  }

export default App;
