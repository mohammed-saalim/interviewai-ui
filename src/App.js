import React, { useState } from 'react';
import FirstLoadPage from './Components/FirstLoadPage';
import OnboardPage from './Components/OnBoardPage';
import ChatPage from './Components/ChatPage';
import {Routes, Route} from 'react-router-dom'

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
      </Routes>
    </div>
   )
  
  // return (
  //   <div className="flex flex-col h-screen">
  //     {/* Navbar */}
  //     <nav className="bg-blue-500 text-white py-4 px-8">
  //       <div className="container mx-auto">
  //         <h1 className="text-xl font-bold">Interview with AI</h1>
  //       </div>
  //     </nav>
      
  //     {/* Chat messages */}
  //     <div className="flex-1 overflow-y-auto bg-gray-100 p-4">
  //       {messages.map((message, index) => (
  //         <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
  //           <span className={`inline-block rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
  //             {message.text}
  //           </span>
  //         </div>
  //       ))}
  //     </div>

  //     {/* Input field and send button */}
  //     <div className="bg-gray-200 p-4">
  //       <div className="container mx-auto flex items-center">
  //         {/* <input
  //           type="text"
  //           value={inputText}
  //           onChange={(e) => setInputText(e.target.value)}
  //           placeholder="Type your message..."
  //           className="flex-1 border border-gray-300 rounded-l py-2 px-4 focus:outline-none focus:ring focus:border-blue-500"
  //         /> */}
  //         <InputCom/>
  //         <button
  //           onClick={handleSendMessage}
  //           className="bg-blue-500 text-white py-2 px-4 rounded-r hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
  //         >
  //           Send
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default App;
