// ChatConversation.js
import React from 'react';

export default function ConversationsPage({ messages }) {
  return (
    <div className="self-center w-full flex flex-col">
      {/* Render messages here */}
      {messages.map((message, index) => (
        <div key={index} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
          <span className={`inline-block rounde d-lg px-4 py-2 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
            {message.text}
          </span>
        </div>
    
      ))}
    </div>
  );
}
