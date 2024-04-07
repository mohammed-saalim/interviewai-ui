// messageUtils.js
export const handleSendMessage = (inputText, setInputText, setMessages) => {
    return () => {
        console.log(inputText);
      if (inputText.trim() === '') return; // Ignore empty messages
      const newMessage = { text: inputText, sender: 'user' };
      console.log(newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]); // Add the user's message to the messages array
      setInputText(''); // Clear the input field after sending the message
      // Call your API to get chatbot response here
      // For demonstration, let's just add a sample response after a delay
      setTimeout(() => {
        console.log("hit");
        const botMessage = { text: 'This sample response chatbot.', sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]); // Add the bot's response to the messages array
      }, 500);
    };
  };
  